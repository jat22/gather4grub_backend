
---------------------- INTERNAL DATA -------------------------------
CREATE TYPE status AS ENUM ('accept', 'decline', 'pending');
CREATE TYPE role AS ENUM ('user', 'admin');

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
	bio TEXT,
	birthdate DATE,
	avatar_url TEXT
);

CREATE TABLE follow_requests(
	id SERIAL PRIMARY KEY,
	from_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	to_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	request_date TIMESTAMP DEFAULT NOW(),
	CONSTRAINT unique_from_to_username UNIQUE (from_username, to_username)
);

CREATE TABLE following (
	id SERIAL PRIMARY KEY, 
	following_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	followed_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	followed_date TIMESTAMP DEFAULT NOW(),
	CONSTRAINT unique_user_connections UNIQUE (following_username, followed_username)
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