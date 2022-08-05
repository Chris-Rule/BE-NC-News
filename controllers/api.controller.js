const APIJSON = require(`${__dirname}/../endpoints.json`);

exports.getAPIJSON = (req, res, next) => {
        res.status(200).send(APIJSON);
}