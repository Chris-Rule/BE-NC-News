const { selectTopics, selectArticleById } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topicData) => {
        res.status(200).send({topics: topicData});
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const {article_id: targetArticleId} = req.params;
    selectArticleById(targetArticleId).then(([articleData]) => {
        res.status(200).send({article: articleData});
    })
    .catch(next);
}