const articlesRouter = require("express").Router()
const {getArticleByArticleId, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleByArticleId} = require("./controller")

articlesRouter.get("/", getArticles)

articlesRouter
    .route("/:article_id")
    .get(getArticleByArticleId)
    .patch(patchArticleByArticleId)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

// app.get("/api/articles/:article_id", getArticleByArticleId)
// app.get("/api/articles", getArticles)
// app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
// app.post("/api/articles/:article_id/comments", postCommentByArticleId)
// app.patch("/api/articles/:article_id", patchArticleByArticleId )


module.exports = articlesRouter