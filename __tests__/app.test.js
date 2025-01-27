const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")

const endpointsJson = require("../endpoints.json");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js")

beforeEach(()=>{
  return seed({topicData, userData, articleData, commentData});
})

afterAll(()=>{
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
  test("200: Responds with an array of topic objects, each of which should have a slug and a description property", ()=>{
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics}})=>{
      expect(topics.length).toBe(3)
      topics.forEach((topic)=>{
        expect(topic).toEqual(expect.objectContaining({
          slug : expect.any(String),
          description : expect.any(String)
        }))
      })
    })
  })
});

describe('GET /api/articles/:article_id', () => {
  test("200: responds with corresponding article object according to requested id, should return one object with relevant properties + data", ()=>{
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body : {article}})=>{
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
});

describe('GET /api/articles', () => {
  test('200: responds with all articles, should an an array of article objects each with relevant properties + datatypes sorted by date in descending order', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}})=>{
      expect(articles.length).toBe(13)
      expect(articles).toBeSortedBy('created_at', {descending: true})
      articles.forEach((article)=>{
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

//error testing
describe('error handling', () => {
  describe('404: not a route', () => {
    test("404: returns with an error message when invalid url requested",()=>{
      return request(app)
      .get("/app")
      .expect(404)
      .then(({body: {error}})=>{
        expect(error).toEqual("Invalid URL!")
      })
    })
  });
  describe('GET /api/articles/:article_id', () => {
    test('400: returns with a bad request error message when invalid article id inputted', () => {
      return request(app)
      .get("/api/articles/FIFTEEN")
      .expect(400)
      .then(({body: {error}})=>{
        expect(error).toEqual("Bad request!")
      })
    });
    test('404: returns with not found message when valid id inputted that has no corresponding article', () => {
      return request(app)
      .get("/api/articles/3141592")
      .expect(404)
      .then(({body: {error}})=>{
        expect(error).toEqual("Not found!")
      })
    });
  });
});