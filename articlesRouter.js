const articlesRouter = require("express").Router()
const { getArticleByArticleId, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleByArticleId, postArticle, deleteArticleByArticleId } = require("./controller")

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route("/:article_id")
    .get(getArticleByArticleId)
    .patch(patchArticleByArticleId)
    .delete(deleteArticleByArticleId)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

module.exports = articlesRouter