const { selectUsers, selectUserByUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
    selectUsers().then((userData) => {
        res.status(200).send({users: userData});
    }).catch(next);
}

exports.getUserByUsername = (req,res,next) => {
    selectUserByUsername(req.params.username)
    .then(([user]) => {
        res.status(200).send({user});
    }).catch(next);
}