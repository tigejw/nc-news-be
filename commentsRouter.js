const commentsRouter = require("express").Router()
const {deleteCommentByCommentId, patchCommentByCommentId} = require("./controller")

commentsRouter
.route("/:comment_id")
.delete(deleteCommentByCommentId)
.patch(patchCommentByCommentId)

module.exports = commentsRouter