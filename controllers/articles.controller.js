const {selectArticleById, updateArticleVotesById } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const {article_id: targetArticleId} = req.params;
    selectArticleById(targetArticleId).then(([articleData]) => {
        res.status(200).send({article: articleData});
    })
    .catch(next);
}

exports.patchArticleVotesById = (req, res, next) => {
    const inc_votes = req.body;
    const {article_id: targetArticleId} = req.params;
    updateArticleVotesById(targetArticleId, inc_votes).then(([articleData]) => {
        res.status(201).send({article: articleData});
    })
    .catch(next);
}