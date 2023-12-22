
---------------------- INTERNAL DATA -------------------------------
CREATE TYPE status AS ENUM ('accept', 'decline', 'pending', 'host');
CREATE TYPE role AS ENUM ('user', 'admin');


CREATE TABLE avatars (
	id SERIAL PRIMARY KEY,
	name TEXT,
	url TEXT
); 

CREATE TABLE users (
	username VARCHAR(20) PRIMARY KEY,
	password TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT,
	email TEXT NOT NULL UNIQUE,
	role role DEFAULT 'user'::role,
	phone TEXT,
	street_address TEXT,
	city TEXT,
	state VARCHAR(2),
	zip VARCHAR(5),
	tag_line TEXT,
	avatar_id INTEGER
		REFERENCES avatars(id) ON DELETE SET NULL
);

CREATE TABLE connection_requests(
	id SERIAL PRIMARY KEY,
	from_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	to_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	request_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE connections (
	id SERIAL PRIMARY KEY,
	user1_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	user2_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	connect_date TIMESTAMP DEFAULT NOW()
);


CREATE TABLE events (
	id SERIAL PRIMARY KEY,
	host VARCHAR
		REFERENCES users(username) ON DELETE SET NULL,
	title TEXT,
	date DATE,
	start_time TIME,
	end_time TIME,
	location TEXT,
	description TEXT
);

CREATE TABLE guests (
	id SERIAL PRIMARY KEY,
	event_id INTEGER NOT NULL
		REFERENCES events(id) ON DELETE CASCADE,
	username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	rsvp status DEFAULT 'pending'::status,
	CONSTRAINT unique_username_eventId UNIQUE (username, event_id)
);

CREATE TABLE courses (
	id SERIAL PRIMARY KEY,
	event_id INTEGER NOT NULL
		REFERENCES events(id) ON DELETE CASCADE,
	name TEXT
);

CREATE TABLE dishes (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	added_by VARCHAR
		REFERENCES users(username) ON DELETE SET NULL,
	description TEXT,
	course_id INTEGER
		REFERENCES courses(id) ON DELETE SET NULL,
	event_id INTEGER NOT NULL
		REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	content TEXT,
	event_id INTEGER NOT NULL
		REFERENCES events(id) ON DELETE CASCADE,
	author VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE SET NULL
);

-- Auxiliary table
CREATE TABLE normalized_request_pairs (
    id SERIAL PRIMARY KEY,
    username1 VARCHAR(255) NOT NULL,
    username2 VARCHAR(255) NOT NULL,
    CONSTRAINT unique_requests UNIQUE (username1, username2)
);

CREATE TABLE normalized_connection_pairs (
    id SERIAL PRIMARY KEY,
    username1 VARCHAR(255) NOT NULL,
    username2 VARCHAR(255) NOT NULL,
    CONSTRAINT unique_connections UNIQUE (username1, username2)
);

-- Triggers

-- Connection Requests check unique
CREATE OR REPLACE FUNCTION check_unique_request_pair()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO normalized_request_pairs (username1, username2)
    VALUES (
        LEAST(NEW.from_username, NEW.to_username),
        GREATEST(NEW.from_username, NEW.to_username)
    ) ON CONFLICT DO NOTHING;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Duplicate connection request.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_unique_request_pair
BEFORE INSERT OR UPDATE OF from_username, to_username
ON connection_requests
FOR EACH ROW
EXECUTE FUNCTION check_unique_request_pair();


-- Connections check unique
CREATE OR REPLACE FUNCTION check_unique_connection_pair()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO normalized_connection_pairs (username1, username2)
    VALUES (
        LEAST(NEW.user1_username, NEW.user2_username),
        GREATEST(NEW.user1_username, NEW.user2_username)
    ) ON CONFLICT DO NOTHING;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Duplicate connection.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_unique_connection_pair
BEFORE INSERT OR UPDATE OF user1_username, user2_username
ON connections
FOR EACH ROW
EXECUTE FUNCTION check_unique_connection_pair();


-- Delete unique connection requests 
CREATE OR REPLACE FUNCTION remove_deleted_request_pair()
RETURNS TRIGGER AS $$
BEGIN
	DELETE FROM normalized_request_pairs
	WHERE 
		(username1 = OLD.from_username AND username2 = OLD.to_username ) 
		OR
		(username1 = OLD.to_username AND username2 = OLD.from_username);
	
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER removed_deleted_request_pair
AFTER DELETE ON connection_requests
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_request_pair();


-- Delete unique connections
CREATE OR REPLACE FUNCTION remove_deleted_connection_pair()
RETURNS TRIGGER AS $$
BEGIN
	DELETE FROM normalized_connection_pairs
	WHERE 
		(username1 = OLD.user1_username AND username2 = OLD.user2_username ) OR
		(username1 = OLD.user2_username AND username2 = OLD.user1_username);
	
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER removed_deleted_connection_pair
AFTER DELETE ON connections
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_connection_pair();