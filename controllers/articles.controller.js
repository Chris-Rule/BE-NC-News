const { commentData } = require("../db/data/test-data");
const { selectArticleById,
        updateArticleVotesById,
        selectArticles,
        selectCommentsByArticleId } = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    selectArticles().then((articlesData) => {
        res.status(200).send({articles: articlesData});
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

exports.patchArticleVotesById = (req, res, next) => {
    const inc_votes = req.body;
    const {article_id: targetArticleId} = req.params;
    updateArticleVotesById(targetArticleId, inc_votes).then(([articleData]) => {
        res.status(201).send({article: articleData});
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id: targetArticleId} = req.params;
    selectCommentsByArticleId(targetArticleId).then((commentData) => {
        res.status(200).send({comments: commentData});
    })
    .catch(next);
}