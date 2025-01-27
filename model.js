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

exports.selectArticleByArticleId = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then((response)=>{
        return response.rows[0]
    })

}