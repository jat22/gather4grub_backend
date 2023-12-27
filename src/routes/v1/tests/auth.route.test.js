const request = require("supertest");

const app = require('../../../app.js')

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
  } = require("./_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe(("POST auth/token"), function(){
	test("works", async function(){
		const resp = await request(app)
			.post("/auth/token")
			.send({
				username: 'testuser2',
				password:'password'
			})

		expect(resp.body).toEqual({
			'token': expect.any(String)
		})
	});

	test("unauthorized with non-existant user", async function(){
		const resp = await request(app)
			.post('/auth/token')
			.send({
				username: "notauser",
				password: 'incorrect'
			})
		expect(resp.statusCode).toEqual(401);
	});

	test("unauthorized with incorrect password", async function(){
		const resp = await request(app)
			.post('/auth/token')
			.send({
				username: "testuser1",
				password: 'incorrect'
			})
		expect(resp.statusCode).toEqual(401);
	});
});

describe("POST /auth/register", function(){
	test("successfully register new user", async function(){
		const resp = await request(app)
			.post('/auth/register')
			.send({
				username: 'test_register',
				password: 'password',
				email: 'test@register.com',
				firstName: 'testing',
				lastName: 'registering'
			});
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.user.username).toEqual('test_register')
		expect(resp.body.token).toEqual(expect.any(String))
	});
	test("does not allow register with missing input", async function(){
		const resp = await request(app)
			.post('/auth/register')
			.send({
				username: 'test_register',
				email: 'test@register.com',
				firstName: 'testing',
				lastName: 'registering'
			});
		expect(resp.statusCode).toEqual(400);
	})
})
