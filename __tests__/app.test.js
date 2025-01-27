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


describe.skip('GET /api/topics', () => {
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