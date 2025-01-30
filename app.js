const express = require("express")
const app = express()
app.use(express.json())

const { getEndpoints, getTopics, getArticleByArticleId, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleByArticleId, deleteCommentByCommentId, getUsers } = require("./controller")

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleByArticleId)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.patch("/api/articles/:article_id", patchArticleByArticleId)
app.delete("/api/comments/:comment_id", deleteCommentByCommentId)
app.get("/api/users", getUsers)

app.all("/*", (req, res) => {
    res.status(404).send({ error: "Invalid URL!" })
})

//error handling middleware

app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ error: "Bad request!" })
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ error: err.msg })
    } else next(err)
})

app.use((err, req, res, next) => {
    console.log(err, "<<< handle this")
    res.status(500).send({ error: "Server Error!", msg: err });
});

module.exports = app