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
        if(response.rows.length===0) {
            return Promise.reject({status: 404, msg: "Not Found!"})
        }
        return response.rows[0]
    })
}

exports.selectAllArticles = () => {
    return db.query(`SELECT title, articles.author, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
        COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id ORDER BY articles.created_at DESC;`)
.then((response)=>{
    response.rows.map((article)=>{
        article.comment_count = Number(article.comment_count)
    })
    return response.rows
})
}