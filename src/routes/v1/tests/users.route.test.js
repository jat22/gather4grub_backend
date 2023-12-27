const request = require('supertest');
const app = require('../../../app.js')

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	user1Token,
	user2Token,
	getEventAId
  } = require("./_testCommon");
const { describe } = require('node:test');
const exp = require('constants');
  

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll)

describe('GET /users/:username', function(){
	test('gets user account info', async function(){
		const resp = await request(app)
			.get('/users/testuser1')
			.set('Authorization', user1Token)
		expect(resp.statusCode).toBe(200);
		expect(resp.body.user.email).toEqual('john.smith@example.com')
	});

	test('unauthoried if not correct user', async function(){
		const resp = await request(app)
			.get('/users/testuser1')
			.set('Authorization', user2Token)

		expect(resp.statusCode).toBe(401)
	});
})

describe('PATCH /users/:username', function(){
	test('updates user information', async function(){
		const resp = await request(app)
			.patch('/users/testuser1')
			.set('Authorization', user1Token)
			.send({
				firstName: 'Jonathon',
				email: 'jonathon.smith@example.com'
			})
		expect(resp.statusCode).toBe(200);
		expect(resp.body.user.firstName).toEqual('Jonathon');
		expect(resp.body.user.lastName).toEqual('smith');
		expect(resp.body.user.email).toEqual('jonathon.smith@example.com')
	});

	test('unauthorized if no correct user', async function(){
		const resp = await request(app)
			.patch('/users/testuser1')
			.set('Authorization', user2Token)
			.send({
				firstName: 'Jonathon',
				email: 'jonathon.smith@example.com'
			})
		expect(resp.statusCode).toBe(401);
	})
})