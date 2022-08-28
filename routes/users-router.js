const { getUsers } = require("../controllers/users.controller");

const usersRouter = require('express').Router();

//topics
usersRouter.get('/', getUsers);

module.exports = usersRouter;