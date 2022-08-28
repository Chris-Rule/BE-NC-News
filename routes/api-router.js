const { getAPIJSON } = require("../controllers/api.controller");

const apiRouter = require('express').Router();
const topicRouter = require("./topics-router");

//Base
apiRouter.get('/',getAPIJSON);

//topics
apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;