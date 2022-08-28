const { getTopics } = require("../controllers/topics.controller")

const topicRouter = require('express').Router();

//topics
topicRouter.get('/', getTopics);

module.exports = topicRouter;