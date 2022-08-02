const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');
//const express = require('express');
//app.use(express.json());

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

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("Status 200 - returns an article object", () => {
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({body}) => {
                const article = body.article;
                expect(typeof body).toBe("object");
                expect(body).toHaveProperty('article');
                expect(typeof article).toBe("object");
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article.article_id).toBe(2);
                expect(article).toHaveProperty('body');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
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