const { getAPIJSON } = require("../controllers/api.controller");

const apiRouter = require('express').Router();
const topicRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

//api
apiRouter.get('/',getAPIJSON);

//routes
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles',articlesRouter);
apiRouter.use('/users',usersRouter);
apiRouter.use('/comments',commentsRouter)

module.exports = apiRouter;