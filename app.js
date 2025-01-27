const express = require("express")
const app = express()
app.use(express.json())

const {getEndpoints} = require("./controller")

app.get("/api", getEndpoints)

app.all("/*", (req, res)=>{
    res.status(404).send({error: "Invalid URL!"})
})

module.exports = app