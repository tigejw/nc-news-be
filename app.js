const express = require("express")
const app = express()
app.use(express.json())

const {getEndpoints, getTopics} = require("./controller")

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)


app.all("/*", (req, res)=>{
    res.status(404).send({error: "Invalid URL!"})
})

module.exports = app