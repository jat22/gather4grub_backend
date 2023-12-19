INSERT INTO avatars
		(name, url)
	VALUES
		('boy', 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png'),
		('smily star eyes', 'https://cdn.pixabay.com/photo/2016/09/01/08/25/smiley-1635456_1280.png'),
		('smily', 'https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635449_1280.png'),
		('man portrait', 'https://cdn.pixabay.com/photo/2016/10/07/12/35/man-1721463_1280.png'),
		('cartoon dog', 'https://cdn.pixabay.com/photo/2016/03/31/20/27/avatar-1295773_1280.png'),
		('blank woman', 'https://cdn.pixabay.com/photo/2014/04/02/14/10/female-306407_1280.png'),
		('kitten', 'https://cdn.pixabay.com/photo/2020/10/11/19/51/cat-5646889_1280.jpg'),
		('man maze head', 'https://cdn.pixabay.com/photo/2019/11/05/20/02/man-4604423_1280.png'),
		('cute peguin face', 'https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_1280.png'),
		('goatee man', 'https://cdn.pixabay.com/photo/2014/03/25/15/23/man-296678_1280.png'),
		('red vamp face', 'https://cdn.pixabay.com/photo/2013/07/12/16/34/vampire-151178_1280.png'),
		('smily money eyes', 'https://cdn.pixabay.com/photo/2016/09/01/08/25/smiley-1635464_1280.png'),
		('evil', 'https://cdn.pixabay.com/photo/2017/03/21/13/27/evil-2162179_1280.png'),
		('gnome', 'https://cdn.pixabay.com/photo/2022/09/08/17/19/gnome-7441442_1280.png'),
		('witch', 'https://cdn.pixabay.com/photo/2020/10/12/23/25/witch-5650399_1280.png'),
		('unicorn', 'https://cdn.pixabay.com/photo/2016/04/01/11/29/avatar-1300370_1280.png');


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