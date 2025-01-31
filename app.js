const express = require("express")
const app = express()
app.use(express.json())
const apiRouter = require("./apiRouter")

//endpoint routing

app.use("/api", apiRouter)

//invalid url handling

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