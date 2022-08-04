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

//TOPICS

describe("/api/topics", () => {
  describe("GET", () => {
      test("Status 200 - Returns array of topic objects", () => {
          return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body).toHaveProperty('topics');
              expect(Array.isArray(body.topics)).toBe(true);
              body.topics.forEach(topic => {expect(topic).
                toEqual(expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String)
                })
              )})
          })
      })
  })
})

//ARTICLES
describe("/api/articles", () => {
  describe("GET", () => {
      test("Status 200 - Returns array of article objects", () => {
          return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body).toHaveProperty('articles');
              expect(body.articles).toBeSortedBy('created_at', {descending: true});
              const firstArticle = body.articles[0];
              expect(firstArticle).toEqual(
                expect.objectContaining({
                  article_id: 3,
                  title: 'Eight pug gifs that remind me of mitch',
                  author: 'icellusedkars',
                  created_at: '2020-11-03T09:12:00.000Z',
                  topic: 'mitch',
                  votes: 0,
                  comment_count: '2'
                }))
              body.articles.forEach(article => {expect(article).
                toEqual(expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  topic: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String)
                })
              )})
          })
      })
  })
})


describe("/api/articles/:article_id", () => {
  describe("GET", () => {
      test("Status 200 - returns an article object", () => {
          return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body).toHaveProperty('article');
              expect(body.article).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: "2020-07-09T20:11:00.000Z",
                  topic: "mitch",
                  votes: 100,
                  comment_count: 11
                }))
          })
      })
      test("Status 404 - Not found, ID is valid but does not exist", () => {
          return request(app).
          get('/api/articles/9999')
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Article not found!');
            });
      })
      test("Status 400 - bad request - invalid ID format", () => {
          return request(app).
          get('/api/articles/notanumber')
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad request!');
            });
      })
  })

  describe("PATCH", () => {
      test("Status 200 - returns an article object", () => {
          const incomingVotes = {
              inc_votes: 5
          }
          return request(app)
          .patch('/api/articles/3')
          .send(incomingVotes)
          .expect(201)
          .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body).toHaveProperty('article');
              expect(body.article).toEqual(
                expect.objectContaining({
                  article_id: 3,
                  title: "Eight pug gifs that remind me of mitch",
                  author: "icellusedkars",
                  body: "some gifs",
                  created_at: "2020-11-03T09:12:00.000Z",
                  topic: "mitch",
                  votes: 5,
                  comment_count: 2
                }))
          })
      })
      test("Status 404 - Not found, ID is valid but does not exist", () => {
          const incomingVotes = {
              inc_votes: 5
          }
          return request(app).
          patch('/api/articles/9999')
          .send(incomingVotes)
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Article not found!');
            });
      })
      test("Status 400 - bad request - invalid ID format", () => {
          const incomingVotes = {
              inc_votes: 5
          }
          return request(app).
          patch('/api/articles/notanumber')
          .send(incomingVotes)
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad request!');
            });
      })
      test("Status 400 - bad request - no inc_votes on body", () => {
          const incomingVotes = {
              no_inc_votes: 3
          }
          return request(app).
          patch('/api/articles/3')
          .send(incomingVotes)
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad request!');
            });
      })
      test("Status 400 - bad request - invalid inc_votes", () => {
          const incomingVotes = {
              inc_votes: "cat"
          }
          return request(app).
          patch('/api/articles/3')
          .send(incomingVotes)
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad request!');
            });
      })
  })
})

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
      test("Status 200 - returns an article object", () => {
          return request(app)
          .get('/api/articles/3/comments')
          .expect(200)
          .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body).toHaveProperty('comments');
              expect(Array.isArray(body.comments)).toBe(true);
              expect(body.comments[0]).toEqual(
                expect.objectContaining({
                  comment_id: 10,
                  votes: 0,
                  created_at: "2020-06-20T07:24:00.000Z",
                  author: "icellusedkars",
                  body: "git push origin master"
                }))
              body.comments.forEach(comment => {expect(comment).
                toEqual(expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                }))})  
          })
      })
      test("Status 404 - Not found, ID is valid but does not exist", () => {
          return request(app).
          get('/api/articles/9999/comments')
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Article not found!');
            });
      })
      test("Status 400 - bad request - invalid ID format", () => {
          return request(app).
          get('/api/articles/notanumber/comments')
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad request!');
            });
      })
  })
})

//USERS
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
              body.users.forEach(user => {expect(user).
                toEqual(expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String)
                })
              )})
          })
      })
  })
})

//GENERAL
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