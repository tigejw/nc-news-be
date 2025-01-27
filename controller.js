const {readEndpointsData, selectAllTopics} = require("./model.js")

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