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

app.use((err, req, res, next)=>{
    if(err.code==="22P02"){
        res.status(400).send({error: "Bad request!"})
    }
    next(err)
})

app.use((err, req, res, next)=>{
    if(err.status && err.msg){
        res.status(404).send({error: "Not found!"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ error: "Server Error!"});
  });

module.exports = app