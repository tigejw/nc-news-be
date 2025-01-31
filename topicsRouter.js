const topicsRouter = require("express").Router()
const { getTopics,postTopic } = require("./controller")

topicsRouter
    .route("/")
    .get(getTopics)
    .post(postTopic)

module.exports = topicsRouter
