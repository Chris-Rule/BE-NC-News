const db = require("../db/connection")

exports.selectTopics = async () => {
    let insertQuery = `SELECT * FROM topics`;
    const { rows } = await db.query(insertQuery);
    return rows;
}

exports.selectArticleById = async (targetArticleId) => {
    const insertQuery = 'SELECT * FROM articles WHERE article_id = $1;'
    const { rows } = await db.query(insertQuery,[targetArticleId]);
    return rows;
}