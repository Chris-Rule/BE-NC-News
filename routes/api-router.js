const { getAPIJSON } = require("../controllers/api.controller");

const apiRouter = require('express').Router();
const topicRouter = require("./topics-router");
const articlesRouter = require("./articles-router");

//api
apiRouter.get('/',getAPIJSON);

//routes
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles',articlesRouter);

module.exports = apiRouter;