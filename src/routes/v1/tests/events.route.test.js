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
  

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll)

describe('POST /events', function(){
	test('successfully creates event', async function(){
		const resp = await request(app)
			.post('/events')
			.send({
				title:'Test Event',
				date: '2024-01-15',
				courses: ['Apps']
			})
			.set('Authorization', user1Token)

		expect(resp.statusCode).toEqual(201)
		expect(resp.body.event.title).toEqual('Test Event')
	});

	test('can not create event if not authenticated', async function(){
		const resp = await request(app)
			.post('/events')
			.send({
				title:'Test Event',
				date: '2024-01-15',
				courses: ['Apps']
			});
		expect(resp.statusCode).toEqual(401)
	});

	test('bad request if required data not provided', async function(){
		const resp = await request(app)
			.post('/events')
			.send({
				title:'Test Event',
				courses: ['Apps']
			})
			.set('Authorization', user1Token);
		expect(resp.statusCode).toEqual(400)
	})
})

describe('GET events/:eventId/full', function(){

	test('gets event info', async function(){
		const eventId = await getEventAId()
		const resp = await request(app)
			.get(`/events/${eventId}/full`)
			.set('Authorization', user1Token)

		expect(resp.statusCode).toBe(200);
		expect(resp.body.event.id).toEqual(eventId)
		expect(resp.body.event.title).toEqual('Testing123')
	})

	test('unauthorized if not event participant', async function(){
		const eventId = await getEventAId()
		const resp = await request(app)
			.get(`/events/${eventId}/full`)
			.set('Authorization', user2Token);

		expect(resp.statusCode).toBe(401)
	})
})

describe('POST /events/:eventId/guests', function(){
	test('adds guest to event', async function(){
		const eventId = await getEventAId()
		const resp = await request(app)
			.post(`/events/${eventId}/guests`)
			.set('Authorization', user1Token)
			.send({usernames: ['testuser2']})
		expect(resp.body.guests.length).toBe(2)
	})
})