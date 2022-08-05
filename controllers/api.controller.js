const fs = require("fs/promises");
const endpointsPath = `${__dirname}/../endpoints.json`;

exports.getAPIJSON = (req, res, next) => {
    return fs.readFile(endpointsPath, 'utf-8').then((endpoints) => {
        res.setHeader('Content-Type', 'application/json')
        const output = JSON.parse(endpoints);
        return res.status(200).send(output);
    }).catch(next);
}