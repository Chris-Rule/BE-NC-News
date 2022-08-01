const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
    describe("GET", () => {
        test("Status 200 - Returns array of topic objects", () => {
            const objectType = "object";
            const objectKeys = ['slug', 'description'];

            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body)).toBe(false);
                expect(typeof body).toBe(objectType);
                expect(body).toHaveProperty('topics');
                expect(Object.keys(body.topics[0])).toEqual(objectKeys);
            })
        })
    })
})

describe("/api/nothinghere", () => {
    describe("GET", () => {
        test("Status 404 - Not found", () => {
            return request(app)
            .get('/app/nothinghere')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('bad path!');
            })
        })
    })
})