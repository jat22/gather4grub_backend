
---------------------- INTERNAL DATA -------------------------------
CREATE TYPE status AS ENUM ('accept', 'decline', 'pending');

CREATE TABLE users (
	username VARCHAR(20) PRIMARY KEY,
	password TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT,
	email TEXT NOT NULL UNIQUE,
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

CREATE TABLE dietary_pref_tags (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE
);

CREATE TABLE user_dietary_pref (
	id SERIAL PRIMARY KEY,
	user_id VARCHAR
		REFERENCES users(username) ON DELETE CASCADE,
	pref_id INTEGER
		REFERENCES dietary_pref_tags(id) ON DELETE SET NULL
);

CREATE TABLE allergy_tags (
	id SERIAL PRIMARY KEY,
	tag TEXT NOT NULL UNIQUE
);

CREATE TABLE user_allergies (
	id SERIAL PRIMARY KEY,
	user_id VARCHAR
		REFERENCES users(username) ON DELETE CASCADE,
	allergy_tag_id INTEGER
		REFERENCES allergy_tags(id) ON DELETE SET NULL
);

CREATE TABLE connections (
	id SERIAL PRIMARY KEY,
	user2_id VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	user1_id VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	connect_date TIMESTAMP,
	status status DEFAULT 'pending'::status
);

CREATE TABLE connection_requests (
	id SERIAL PRIMARY KEY,
	requesting_id VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	requested_id VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	request_datetime TIMESTAMP
);

CREATE TABLE parties (
	id SERIAL PRIMARY KEY,
	host_id VARCHAR
		REFERENCES users(username) ON DELETE SET NULL,
	date DATE,
	start_time TIME,
	end_time TIME,
	location TEXT,
	theme TEXT,
	description TEXT,
	cover_img TEXT
);



CREATE TABLE party_guests (
	id SERIAL PRIMARY KEY,
	party_id INTEGER NOT NULL
		REFERENCES parties(id) ON DELETE CASCADE,
	guest_id VARCHAR NOT NULL
		REFERENCES users(username) ON DELETE CASCADE,
	rsvp status DEFAULT 'pending'::status
);

CREATE TABLE courses (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE
);

CREATE TABLE party_courses (
	id SERIAL PRIMARY KEY,
	course_id INTEGER NOT NULL
		REFERENCES courses(id) ON DELETE CASCADE,
	party_id INTEGER NOT NULL
		REFERENCES parties(id) ON DELETE CASCADE,
	notes TEXT
);

CREATE TABLE dishes (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	source_name TEXT,
	source_url TEXT,
	user_id VARCHAR
		REFERENCES users(username) ON DELETE SET NULL,
	description TEXT,
	instructions TEXT,
	img_url TEXT
);

CREATE TABLE ingredients (
	id SERIAL PRIMARY KEY,
	name TEXT
);

CREATE TABLE dish_ingredients (
	id SERIAL PRIMARY KEY,
	dish_id INTEGER
		REFERENCES dishes(id) ON DELETE CASCADE,
	ingredient_id INTEGER
		REFERENCES ingredients(id),
	amount TEXT
);

CREATE TABLE dish_allergy_tags (
	id SERIAL PRIMARY KEY,
	dish_id INTEGER
		REFERENCES dishes(id) ON DELETE CASCADE,
	allergy_tag_id INTEGER
		REFERENCES allergy_tags(id) ON DELETE CASCADE
);

CREATE TABLE dish_diet_pref_tags (
	id SERIAL PRIMARY KEY,
	dish_id INTEGER
		REFERENCES dishes(id) ON DELETE CASCADE,
	pref_id INTEGER
		REFERENCES dietary_pref_tags(id) ON DELETE SET NULL
);

CREATE TABLE party_dishes (
	id SERIAL PRIMARY KEY,
	party_id INTEGER NOT NULL
		REFERENCES parties(id) ON DELETE CASCADE,
	dish_id INTEGER NOT NULL
		REFERENCES dishes(id) ON DELETE CASCADE,
	course_id INTEGER
		REFERENCES party_courses(id) ON DELETE SET NULL
);

CREATE TABLE discussions (
	id SERIAL PRIMARY KEY,
	title VARCHAR(50),
	body TEXT,
	party_id INTEGER NOT NULL
		REFERENCES parties(id) ON DELETE CASCADE,
	author_id VARCHAR
		REFERENCES users(username) ON DELETE SET NULL
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	body TEXT,
	discussion_id INTEGER NOT NULL
		REFERENCES discussions(id) ON DELETE CASCADE,
	author_id VARCHAR
		REFERENCES users(username) ON DELETE SET NULL
);