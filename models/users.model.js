const db = require("../db/connection")

exports.selectUsers = async () => {
    let insertQuery = `SELECT * FROM users`;
    const { rows } = await db.query(insertQuery);
    return rows;
}