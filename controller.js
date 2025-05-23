const { readEndpointsData, selectAllTopics, selectArticleByArticleId, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleByArticleId, deleteFromCommentsByCommentId, selectAllUsers, selectUserByUsername, updateCommentByCommentId, insertArticle, insertTopic, deleteFromArticlesAndCommentsByArticleId } = require("./model.js")

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
    const { sort_by, order, topic } = req.query
    selectAllArticles(sort_by, order, topic)
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
    return insertCommentByArticleId(article_id, body)
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
    updateArticleByArticleId(article_id, body)
        .then((article) => {
            res.status(200).send({ article: article })
        })
        .catch((err) => {
            next(err)
        })
}

exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    deleteFromCommentsByCommentId(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUsers = (req, res, next) => {
    selectAllUsers()
        .then((users) => {
            res.status(200).send({ users: users })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user: user })
        })
        .catch((err) => {
            next(err)
        })
}

exports.patchCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateCommentByCommentId(inc_votes, comment_id)
        .then((comment) => {
            res.status(200).send({ comment: comment })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    insertArticle(author, title, body, topic, article_img_url)
    .then((article)=>{
        res.status(201).send({article: article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postTopic = (req, res, next) => {
    const {slug, description} = req.body
    insertTopic(slug, description)
    .then((topic)=>{
        res.status(201).send({topic: topic})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.deleteArticleByArticleId = (req, res, next) => {
    const {article_id} = req.params
    deleteFromArticlesAndCommentsByArticleId(article_id)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}