const express = require("express")
const app = express()
app.use(express.json())

const {getEndpoints, getTopics, getArticleByArticleId} = require("./controller")

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleByArticleId)

app.all("/*", (req, res)=>{
    res.status(404).send({error: "Invalid URL!"})
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Server Error!"});
  });

module.exports = app