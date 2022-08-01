const { selectTopics } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topicData) => {
        res.status(200).send({topics: topicData});
    })
    .catch(next);
}




// exports.getTreasures = (req, res, next) => {
//     const sortBy = req.query.sort_by;
//     const orderBy = req.query.order;
//     const colour = req.query.colour;
//     selectTreasures(sortBy,orderBy,colour)
//       .then((treasures) => {
//         res.status(200).send(treasures);
//       })
//       .catch(next);
//   };