INSERT INTO users 
		(username, password, first_name, last_name, email)
	VALUES
		(
			'testuser1', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test1',
			'user1',
			'test1@testuser.com'
		),
		(
			'testuser2', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test2',
			'user2',
			'test2@testuser.com'
		),
		(
			'testuser3', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test3',
			'user3',
			'test3@testuser.com'
		),
		(
			'testuser4', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test4',
			'user4',
			'test4@testuser.com'
		),
		(
			'testuser5', 
			'$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
			'test5',
			'user5',
			'test5@testuser.com'
		);

INSERT INTO events
		(host, title, date)
	VALUES
		('testuser1', 'Test Event One', '2023-12-01'),
		('testuser1', 'Test Event Two', '2023-12-01'),
		('testuser2', 'Test Event Three', '2023-12-01'),
		('testuser2', 'Test Event Four', '2023-12-01'),
		('testuser3', 'Test Event Five', '2023-12-01');

INSERT INTO connections
		(user1_username, user2_username)
	VALUES
		('testuser1', 'testuser2'),
		('testuser1', 'testuser3'),
		('testuser1', 'testuser4'),
		('testuser1', 'testuser5'),
		('testuser2', 'testuser4'),
		('testuser2', 'testuser5'),
		('testuser5', 'testuser4'),
		('testuser5', 'testuser3');
