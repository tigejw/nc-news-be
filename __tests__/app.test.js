const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")

const endpointsJson = require("../endpoints.json");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index.js");

beforeEach(() => {
  jest.setTimeout(25000)
  return seed({ topicData, userData, articleData, commentData });
})

afterAll(() => {
  return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET /api/topics', () => {
  test("200: Responds with an array of topic objects, each of which should have a slug and a description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String)
          }))
        })
      })
  })
});

describe('GET /api/articles/:article_id', () => {
  test("200: responds with corresponding article object according to requested id, should return one object with relevant properties + data", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          topic: "mitch",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        })
      })
  })
  describe('error handling', () => {
    test('400: returns with a bad request error message when invalid article id inputted', () => {
      return request(app)
        .get("/api/articles/FIFTEEN")
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
    test('404: returns with not found message when valid id inputted that has no corresponding article', () => {
      return request(app)
        .get("/api/articles/3141592")
        .expect(404)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Not found!")
        })
    });
  });
});

describe('GET /api/articles', () => {
  test('200: responds with all articles, should an an array of article objects each with relevant properties + datatypes sorted by date in descending order', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13)
        expect(articles).toBeSortedBy('created_at', { descending: true })
        articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          }))
        })
      })
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: should respond with an array of comment objects for relevant article_id with expected properties + datatypes in date ordered desc ', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11)
        expect(comments).toBeSortedBy("created_at", { descending: true })
        comments.forEach((comment) => {
          expect(comment).toEqual(expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          }))
        })
      })
  });
  test("200: returns 200 + empty array when valid article_id inputted where corresponding article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0)
      })
  })
  describe('error handling', () => {
    test('400: bad request when invalid article_id inputted', () => {
      return request(app)
        .get("/api/articles/FIFTEEN/comments")
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
    test('404: not found when valid article_id inputted but no corresponding article exists', () => {
      return request(app)
        .get("/api/articles/3141592/comments")
        .expect(404)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Not found!")
        })
    });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('should respond with 201 status code and posted data', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "icellusedkars", body: "literal chills" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 2
        }))
      })
  });
  describe('error handling', () => {
    test('400: inputted username valid but doesnt already exist', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "tjw", body: "c:" })
        .expect(404)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Not found!")
        })
    });
    test('400: articlie id is invalid', () => {
      return request(app)
        .post("/api/articles/FIFTEEN/comments")
        .send({ username: "icellusedkars", body: "literal chills" })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
    test('404: article_id valid but article does not exist', () => {
      return request(app)
        .post("/api/articles/3141592/comments")
        .send({ username: "icellusedkars", body: "literal chills" })
        .expect(404)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Not found!")
        })
    });
    test('400: post body does not contain the correct properies ', () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "icellusedkars" })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
    test('400: posted body properties are null/wrong datatype', () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "icellusedkars", body: null })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: should adjust votes of relevant article and return updated article object', () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 12 })
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(112)
      })
  });
  test('200: should also decrement articles votes if negative votes inputted and work with articles with 0 existing votes', () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: -1 })
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(-1)
      })
  });
  describe('error handling', () => {
    test('400: patch body does not contain the correct fields', () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toBe("Bad request!")
        })
    });
    test('400: patch with valid fields but wrong datatype', () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "word" })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toBe("Bad request!")
        })
    });
    test('400: article_id is invalid', () => {
      return request(app)
        .patch("/api/articles/FIFTEEN")
        .send({ inc_votes: -1 })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
    test('404: article_id is valid but article doesnt exist', () => {
      return request(app)
        .patch("/api/articles/314")
        .send({ inc_votes: -1 })
        .then(({ body: { error } }) => {
          expect(error).toEqual("Not found!")
        })
    });
  });
});

describe('DELETE /api/comments/comment_id', () => {
  test('204: should delete comment referenced by comment_id and return nothing', () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
  });
  describe('error handling', () => {
    test('404: returns 404 + error message when attempting to delete a valid comment_id that does not exist', () => {
      return request(app)
        .delete("/api/comments/3141592")
        .expect(404)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Not found!")
        })
    });
    test('400: returns 400 + error message when invalid id inputted', () => {
      return request(app)
        .delete("/api/comments/FIFTEEN")
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toEqual("Bad request!")
        })
    });
  });
});

describe.only('Get /api/users', () => {
  test('200: should respond with an array of user objects with expected properties and datatypes', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: {users}})=>{
      expect(users.length).toBe(4)
      users.forEach((user)=>{
        expect(user).toEqual(expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url : expect.any(String)
        }))
      })
    })
  });
});

describe('404: invalid url', () => {
  test("404: returns with an error message when invalid url requested", () => {
    return request(app)
      .get("/app")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toEqual("Invalid URL!")
      })
  })
});
