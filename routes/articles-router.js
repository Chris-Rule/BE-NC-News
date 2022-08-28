const { getArticleById, 
    patchArticleVotesById, 
    getArticles, 
    getCommentsByArticleId, 
    postCommentByArticleId } = require("../controllers/articles.controller")

const articlesRouter = require('express').Router();

//articles
articlesRouter.get('/',getArticles);
articlesRouter.get('/:article_id',getArticleById);
articlesRouter.get('/:article_id/comments',getCommentsByArticleId);
articlesRouter.patch('/:article_id',patchArticleVotesById);
articlesRouter.post('/:article_id/comments', postCommentByArticleId);

module.exports = articlesRouter;