const { selectUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
    selectUsers().then((userData) => {
        res.status(200).send({users: userData});
    })
    .catch(next);
}