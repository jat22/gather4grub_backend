
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

CREATE TABLE gatherings (
	id SERIAL PRIMARY KEY,
	host VARCHAR
		REFERENCES users(username) ON DELETE SET NULL,
	title TEXT,
	date DATE,
	start_time TIME,
	end_time TIME,
	location TEXT,
	theme TEXT,
	description TEXT,
	cover_img TEXT
);

CREATE TABLE types_of_gathering (
	id SERIAL PRIMARY KEY,
	title TEXT
);

CREATE TABLE gatherings_types (
	id SERIAL PRIMARY KEY,
	gathering_id INTEGER NOT NULL
		REFERENCES gatherings(id) ON DELETE CASCADE,
	type_id INTEGER NOT NULL
		REFERENCES types_of_gathering(id)
);

CREATE TABLE guests (
	id SERIAL PRIMARY KEY,
	gathering_id INTEGER NOT NULL
		REFERENCES gatherings(id) ON DELETE CASCADE,
	username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	rsvp status DEFAULT 'pending'::status
);

CREATE TABLE courses (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	gathering_id INTEGER NOT NULL
		REFERENCES gatherings(id) ON DELETE CASCADE,
	notes TEXT
);

CREATE TABLE dishes (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	source_name TEXT,
	source_url TEXT,
	added_by VARCHAR
		REFERENCES users(username) ON DELETE SET NULL,
	description TEXT,
	instructions TEXT,
	img_url TEXT
);

CREATE TABLE ingredients (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	dish_id INTEGER
		REFERENCES dishes(id) ON DELETE CASCADE,
	amount TEXT NOT NULL
);

CREATE TABLE gathering_dishes (
	id SERIAL PRIMARY KEY,
	gathering_id INTEGER NOT NULL
		REFERENCES gatherings(id) ON DELETE CASCADE,
	dish_id INTEGER NOT NULL
		REFERENCES dishes(id) ON DELETE CASCADE,
	course_id INTEGER
		REFERENCES gathering_courses(id) ON DELETE SET NULL,
	owner_username VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	title VARCHAR(50),
	body TEXT,
	gathering_id INTEGER NOT NULL
		REFERENCES gatherings(id) ON DELETE CASCADE,
	author VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE SET NULL
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	body TEXT,
	post_id INTEGER NOT NULL
		REFERENCES posts(id) ON DELETE CASCADE,
	author VARCHAR
		REFERENCES users(username) ON DELETE SET NULL
);