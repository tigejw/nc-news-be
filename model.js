const fs = require("fs/promises")
const db = require("./db/connection")

exports.readEndpointsData = () => {
    return fs.readFile(`${__dirname}/endpoints.json`,"utf8")
    .then((endpoints)=>{
        return JSON.parse(endpoints)
    })
}

exports.selectAllTopics = () => {
    return db.query("SELECT * FROM topics").then((response)=>{
        return response.rows
    })
}