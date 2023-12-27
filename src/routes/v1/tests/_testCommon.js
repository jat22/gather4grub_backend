const db = require('../../../db.js')
const UserServices = require('../../../services/user.services.js')
const authSerivces = require('../../../services/auth.services.js')
const eventServices = require('../../../services/events.services.js')

async function commonBeforeAll(){
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM events');

	await UserServices.createUser({
		username: 'testuser1',
		password: 'password',
		email: 'john.smith@example.com',
		firstName : 'john',
		lastName: 'smith'
	});
	await UserServices.createUser({
		username: 'testuser2',
		password: 'password',
		email: 'john.allen@example.com',
		firstName : 'john',
		lastName: 'allen'
	});
	await UserServices.createUser({
		username: 'testuser3',
		password: 'password',
		email: 'john.bug@example.com',
		firstName : 'john',
		lastName: 'bug'
	});

	await eventServices.createEvent('testuser1',{
		title: 'Testing123',
		date: '2424-01-01',
		courses: []
	})


}


async function commonBeforeEach() {
	await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
	await db.query("ROLLBACK");
  }

async function commonAfterAll(){
	await db.end()
}

async function getEventAId(){
	const res = await db.query(`SELECT id FROM events WHERE title='Testing123'`)
	return res.rows[0]?.id
}

const user1Token = authSerivces.generateToken({username: 'testuser1', password: 'password'})
const user2Token = authSerivces.generateToken({username: 'testuser2', password: 'password'})


module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	user1Token,
	user2Token,
	getEventAId
}