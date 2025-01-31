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
            return db.query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::int AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [article_id])
                .then(({ rows }) => {
                    if (rows.length === 0) {
                        return Promise.reject({ status: 404, msg: "Not found!" })
                    }
                    return rows[0]
                })
        })
}

exports.selectAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const greenList = ["title", "author", "article_id", "created_at", "votes", "comment_count", "desc", "asc"]
    let dbQuery = `SELECT title, articles.author, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
    const queryValues = []

    if (!greenList.includes(sort_by) || !greenList.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid query!" })
    }

    if (topic) {
        return checkExists("topics", "slug", topic)
            .then(() => {
                queryValues.push(topic)
                dbQuery += `WHERE articles.topic = $1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
                return db.query(dbQuery, queryValues)
            })
            .then(({ rows }) => {
                return rows
            })
    } else {
        dbQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
        return db.query(dbQuery)
            .then(({ rows }) => {
                return rows
            })
    }



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
        .then(({ rows }) => {
            return rows
        })
}

exports.selectUserByUsername = (username) => {
    return checkExists("users", "username", username)
        .then(() => {
            return db.query("SELECT * FROM users WHERE username = $1", [username])
        })
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.updateCommentByCommentId = (inc_votes, comment_id) => {
    if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: "Bad request!" })
    }
    return checkExists("comments", "comment_id", comment_id)
        .then(() => {
            return db.query("UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;", [inc_votes, comment_id])
        })
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.insertArticle = (author, title, body, topic, article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=70") => {
    return checkExists("users", "username", author)
        .then(()=>{
            return checkExists("topics", "slug", topic)
        })
        .then(() => {
            return db.query("INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *", [author, title, body, topic, article_img_url])
        })
        .then(({ rows }) => {
            rows[0].comment_count = 0
            return rows[0]
        })
}
