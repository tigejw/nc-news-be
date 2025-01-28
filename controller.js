const { readEndpointsData, selectAllTopics, selectArticleByArticleId, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleByArticleId } = require("./model.js")
const { checkUserExists } = require("./db/seeds/utils.js")

exports.getEndpoints = (req, res, next) => {
    readEndpointsData().then((endpointsData) => {
        res.status(200).send({ endpoints: endpointsData })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topicsData) => {
        res.status(200).send({ topics: topicsData })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByArticleId(article_id).then((article) => {
        res.status(200).send({ article: article })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getArticles = (req, res, next) => {
    selectAllArticles()
        .then((articlesData) => {
            res.status(200).send({ articles: articlesData })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id)
        .then((commentsData) => {
            res.status(200).send({ comments: commentsData })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    checkUserExists(body.username)
        .then(() => {
            return insertCommentByArticleId(article_id, body)
        })
        .then((comment) => {
            res.status(201).send({ comment: comment })
        })
        .catch((err) => {
            next(err)
        })

}

exports.patchArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req
    if (typeof body.inc_votes !== "number") {
        next({ status: 400, msg: "Bad request!" })
    } else {
        updateArticleByArticleId(article_id, body)
            .then((article) => {
                res.status(200).send({ article: article })
            })
            .catch((err) => {
                next(err)
            })
    }
}