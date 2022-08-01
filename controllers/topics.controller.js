const { selectTopics } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topicData) => {
        console.log(res);
        res.status(200).send({topics: topicData});
    })
    .catch(next);
}