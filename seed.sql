INSERT INTO users 
		(username, password, first_name, last_name, email, phone, street_address, city, state, zip, tag_line, bio, birthdate, avatar_url)
	VALUES
		(
			'testuser1', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test1',
			'user1',
			'test1@testuser.com',
			'111-111-1111',
			'123 abc st',
			'town',
			'US',
			'11111',
			'testing user info all day',
			'Up for anything, hit me up bro.',
			'1999-05-11',
			'http://www.pictures.com'
		),
		(
			'testuser2', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test2',
			'user2',
			'test2@testuser.com',
			'222-222-2222',
			'345 abc st',
			'town2',
			'U2',
			'22222',
			'testing user2 info all day',
			'Up for anything, hit me up bro2.',
			'2000-05-11',
			'http://www.pictures2.com'
		);

INSERT INTO dietary_pref_tags(name)
	VALUES 
		('Vegan'), 
		('Vegatarian'), 
		('Pescatarian'), 
		('Gluten-Free'), 
		('Paleo'),
		('Keto'),
		('Mediterranean'),
		('Whole-Food'),
		('Plant-Based');

INSERT INTO allergy_tags(tag)
	VALUES
		('Gluten'),
		('Dairy'),
		('Egg'),
		('Peanuts'),
		('Tree Nuts'),
		('Shellfish'),
		('Fish'),
		('Wheat'),
		('Soy');

INSERT INTO courses (name)
	VALUES
		('Starters'),
		('Mains'),
		('Sides'),
		('Meats'),
		('Vegetables'),
		('Desserts');

