const express = require("express")
const app = express()
app.use(express.json())

const {getEndpoints} = require("./controller")

app.get("/api", getEndpoints)

app.all("/*", (req, res)=>{
    res.status(404).send({msg: "URL not found!"})
})

module.exports = app