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
              expect(body.topics[0]).toHaveProperty('slug');
              expect(body.topics[0]).toHaveProperty('description');
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
              expect(firstArticle).toHaveProperty('author');
              expect(firstArticle).toHaveProperty('title');
              expect(firstArticle).toHaveProperty('article_id');
              expect(firstArticle.article_id).toBe(3);
              expect(firstArticle).toHaveProperty('comment_count');
              expect(firstArticle.comment_count).toBe("2");
              expect(firstArticle).toHaveProperty('topic');
              expect(firstArticle).toHaveProperty('created_at');
              expect(firstArticle.created_at).toBe("2020-11-03T09:12:00.000Z");
              expect(firstArticle).toHaveProperty('votes');

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
              const article = body.article;
              expect(typeof body).toBe("object");
              expect(body).toHaveProperty('article');
              expect(typeof article).toBe("object");
              expect(article).toHaveProperty('author');
              expect(article).toHaveProperty('title');
              expect(article).toHaveProperty('article_id');
              expect(article.article_id).toBe(1);
              expect(article).toHaveProperty('comment_count');
              expect(article.comment_count).toBe(11);
              expect(article).toHaveProperty('body');
              expect(article).toHaveProperty('topic');
              expect(article).toHaveProperty('created_at');
              expect(article).toHaveProperty('votes');
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
              const article = body.article;
  
              expect(typeof body).toBe("object");
              expect(body).toHaveProperty('article');
              expect(typeof article).toBe("object");
              expect(article).toHaveProperty('article_id');
              expect(article.article_id).toBe(3);
              expect(article).toHaveProperty('comment_count');
              expect(article.comment_count).toBe(2);
              expect(article).toHaveProperty('votes');
              expect(article.votes).toBe(5);
              expect(article).toHaveProperty('author');
              expect(article).toHaveProperty('title');
              expect(article).toHaveProperty('body');
              expect(article).toHaveProperty('topic');
              expect(article).toHaveProperty('created_at');
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
              expect(body.users[0]).toHaveProperty('username');
              expect(body.users[0]).toHaveProperty('name');
              expect(body.users[0]).toHaveProperty('avatar_url');
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