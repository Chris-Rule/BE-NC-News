const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');
const res = require('express/lib/response');

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
      test("Status 200 - Returns array of article objects sorted by date by default", () => {
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
      test("Status 200 - Returns array of article objects sorted by article_id", () => {
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty('articles');
            expect(body.articles).toBeSortedBy('article_id', {descending: true});
            const firstArticle = body.articles[0];
            expect(firstArticle).toEqual(
              expect.objectContaining({
                article_id: 12,
                title: 'Moustache',
                author: 'butter_bridge',
                created_at: '2020-10-11T11:24:00.000Z',
                topic: 'mitch',
                votes: 0,
                comment_count: '0'
              }))
            expect(body.articles.length).not.toBe(0);
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
    test("Status 200 - Returns array of article objects sorted by title in ascending order", () => {
      return request(app)
      .get('/api/articles?sort_by=title&order=asc')
      .expect(200)
      .then(({body}) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('articles');
          expect(body.articles).toBeSortedBy('title', {descending: false});
          const firstArticle = body.articles[0];
          expect(firstArticle).toEqual(
            expect.objectContaining({
              article_id: 6,
              title: 'A',
              author: 'icellusedkars',
              created_at: '2020-10-18T01:00:00.000Z',
              topic: 'mitch',
              votes: 0,
              comment_count: '1'
            }))
          expect(body.articles.length).not.toBe(0);
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
    test("Status 200 - Returns array of article objects sorted by votes in descending order filtered by topic 'mitch'", () => {
      return request(app)
      .get('/api/articles?sort_by=votes&order=desc&topic=mitch')
      .expect(200)
      .then(({body}) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('articles');
          expect(body.articles).toBeSortedBy('votes', {descending: true});
          const firstArticle = body.articles[0];
          expect(firstArticle).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              author: 'butter_bridge',
              created_at: '2020-07-09T20:11:00.000Z',
              topic: 'mitch',
              votes: 100,
              comment_count: '11'
            }))
          expect(body.articles.length).not.toBe(0);
          body.articles.forEach(article => {expect(article).
            toEqual(expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              topic: 'mitch',
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          )})
      })
    })
    test('Status 200 - filter by a topic that exists but has no associated articles', () => {
      return request(app)
      .get('/api/articles?sort_by=title&order=desc&topic=paper')
      .expect(200)
      .then(({body}) => {
        expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty('articles');
            expect(body.articles.length).toBe(0); 
      })
    })
    test('Status 400 - sort_by a column that does not exist', () => {
      return request(app)
      .get('/api/articles?sort_by=DAVE&order=desc&topic=mitch')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad request!');
      })
    })
    test('Status 400 - request an order that does not exist', () => {
      return request(app)
      .get('/api/articles?sort_by=title&order=BANANA&topic=mitch')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad request!');
      })
    })
    test('Status 400 - filter by a topic that does not exist', () => {
      return request(app)
      .get('/api/articles?sort_by=title&order=desc&topic=VERISIMILITUDE')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad request!');
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
      test("Status 200 - returns an array of comment objects", () => {
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
              expect(body.comments.length).toBe(2);
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
      test("Status 200 - returns a zero length array when no comments", () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty('comments');
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length).toBe(0); 
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
  describe("POST", () => {
    test("Status 201 - returns the posted comment", () => {
      const incomingComment = {
        username: "icellusedkars",
        body: "Posting my first comment!"
    }
      return request(app)
      .post('/api/articles/2/comments')
      .send(incomingComment)
      .expect(201)
      .then(({ body}) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty('comment');
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              article_id:2,
              votes: 0,
              created_at: expect.any(String),
              author: "icellusedkars",
              body: "Posting my first comment!"
              }))
      })
    })

    test("Status 400 - bad request - request data missing", () => {
      const incomingComment = {
        body: "This comment is a lie!"
    }
      return request(app)
      .post('/api/articles/2/comments')
      .send(incomingComment)
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe('Bad request!');
      })
    })

    test("Status 400 - username is not valid", () => {
      const incomingComment = {
        username: "Cat",
        body: "This comment is a lie!"
    }
      return request(app)
      .post('/api/articles/2/comments')
      .send(incomingComment)
      .expect(404)
      .then(({ body}) => {
        expect(body.msg).toBe('Username not found!');
      })
    })

    test("Status 400 - body has no content", () => {
      const incomingComment = {
        username: "icellusedkars",
        body: ""
    }
      return request(app)
      .post('/api/articles/2/comments')
      .send(incomingComment)
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe('Bad request!');
      })
    })

    test("Status 404 - Not found, ID is valid but does not exist", () => {
      const incomingComment = {
        username: "icellusedkars",
        body: "Posting my first comment!"
    }
      return request(app).
      get('/api/articles/9999/comments')
      .expect(404)
      .send(incomingComment)
      .then(({ body }) => {
          expect(body.msg).toBe('Article not found!');
        });
    })

    test("Status 400 - bad request - invalid ID format", () => {
      const incomingComment = {
        username: "icellusedkars",
        body: "Posting my first comment!"
    }
      return request(app).
      get('/api/articles/notanumber/comments')
      .expect(400)
      .send(incomingComment)
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

//COMMENTS
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("Status 204 - deletes the comment and returns no content", () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then((body) => {
        expect(body.status).toBe(204);
      });
    })
    test("Status 404 - valid ID that doesn't exist", () => {
      return request(app)
      .delete('/api/comments/9999')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Not found!');
      });
    })
    test("Status 400 - invalid comment id", () => {
      return request(app)
      .delete('/api/comments/BANANA')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad request!');
      });
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