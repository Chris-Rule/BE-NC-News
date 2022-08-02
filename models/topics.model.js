const db = require("../db/connection")

exports.selectTopics = async () => {
    let insertQuery = `SELECT * FROM topics`;
    const { rows } = await db.query(insertQuery);
    return rows;
}