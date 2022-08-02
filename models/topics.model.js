const { rows } = require("pg/lib/defaults");
const db = require("../db/connection")

exports.selectTopics = async () => {
    let insertQuery = `SELECT * FROM topics`;
    const { rows } = await db.query(insertQuery);
    return rows;
}

exports.selectArticleById = async (targetArticleId) => {
    
    if(!Number.isInteger(Number(targetArticleId))){
        return Promise.reject({status: 400, msg:'Bad request!'})
    } else{
        const insertQuery = 'SELECT * FROM articles WHERE article_id = $1;'
        const {rows: article} = await db.query(insertQuery,[targetArticleId]);
        if(article.length === 0){
            return Promise.reject({status:404, msg:'Article not found!'});
        }
        return article;
    }
}