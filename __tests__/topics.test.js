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
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe("object");
                expect(body).toHaveProperty('topics');
                expect(Array.isArray(body.topics)).toBe(true);
                expect(body.topics[0]).toHaveProperty('slug');
                expect(body.topics[0]).toHaveProperty('description');
            })
        })
    })
})
