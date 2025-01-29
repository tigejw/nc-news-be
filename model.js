const fs = require("fs/promises")
const db = require("./db/connection")
const { checkExists } = require("./db/seeds/utils")

exports.readEndpointsData = () => {
    return fs.readFile(`${__dirname}/endpoints.json`, "utf8")
        .then((endpoints) => {
            return JSON.parse(endpoints)
        })
}

exports.selectAllTopics = () => {
    return db.query("SELECT * FROM topics").then(({ rows }) => {
        return rows
    })
}

exports.selectArticleByArticleId = (article_id) => {
    return checkExists("articles", "article_id", article_id).
    then(() => {
        return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found!" })
            }
            return rows[0]
        })
    })
}

exports.selectAllArticles = () => {
    return db.query(`SELECT title, articles.author, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
        COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => {
            return rows
        })
}

exports.selectCommentsByArticleId = (article_id) => {
    return checkExists("articles", "article_id", article_id)
    .then(() => {
        return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
            .then(({ rows }) => {
                return rows
            })
    })
}

exports.insertCommentByArticleId = (article_id, body) => {
    return checkExists("articles", "article_id", article_id)
        .then(() => {
            return checkExists("users", "username", body.username)
        })
        .then(() => {
            return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`, [body.username, body.body, article_id])
        })
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.updateArticleByArticleId = (article_id, body) => {
    if (typeof body.inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: "Bad request!" })
    } else {
        return checkExists("articles", "article_id", article_id).then(() => {
            return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [body.inc_votes, article_id])
                .then(({ rows }) => {
                    return rows[0]
                })
        })
    }
    
}

exports.deleteFromCommentsByCommentId = (comment_id) => {
    return checkExists("comments", "comment_id", comment_id).then(() => {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    })
}

exports.selectAllUsers = () => {
    return db.query("SELECT username, name, avatar_url FROM users")
    .then(({rows})=>{
        return rows
    })
}