const {readEndpointsData} = require("./model.js")

exports.getEndpoints = (req, res, next) => {
    readEndpointsData().then((endpointsData)=>{
        res.status(200).send({endpoints : endpointsData})
    })
}