const {readEndpointsData, selectAllTopics, selectArticleByArticleId} = require("./model.js")

exports.getEndpoints = (req, res, next) => {
    readEndpointsData().then((endpointsData)=>{
        res.status(200).send({endpoints : endpointsData})
    })
}

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topicsData)=>{
        res.status(200).send({topics : topicsData})
    })
}

exports.getArticleByArticleId = (req, res, next) => {
    const {article_id} = req.params
    selectArticleByArticleId(article_id).then((article)=>{
        res.status(200).send({article : article})
    })
}