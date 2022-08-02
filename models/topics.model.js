const { rows } = require("pg/lib/defaults");
const db = require("../db/connection")
const format = require("pg-format");

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

exports.updateArticleVotesById = async (targetArticleId, incomingVotes) => {

    const newVotes = incomingVotes.inc_votes;

    if(!Number.isInteger(Number(targetArticleId))){
        return Promise.reject({status: 400, msg:'Bad request!'});
    } else if(!Number.isInteger(Number(newVotes))){ //catches both invalid inc_votes and missing inc_votes
        return Promise.reject({status: 400, msg:'Bad request!'});
    } else {
        const updateQuery = format('UPDATE articles SET votes = votes + %s WHERE article_id = %s returning *;',newVotes,targetArticleId);
        const {rows: article} = await db.query(updateQuery);

        if(article.length === 0){
            return Promise.reject({status:404, msg:'Article not found!'});
        }
        return article;
    }

}