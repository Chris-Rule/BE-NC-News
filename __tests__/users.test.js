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

describe("/api/users", () => {
    describe("GET", () => {
        test("Status 200 - Returns array of user objects", () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('users');
                expect(Array.isArray(body.users)).toBe(true);
                expect(body.users[0]).toHaveProperty('username');
                expect(body.users[0]).toHaveProperty('name');
                expect(body.users[0]).toHaveProperty('avatar_url');
            })
        })
    })
})
