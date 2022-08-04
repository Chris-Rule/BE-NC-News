const db = require("../db/connection")
const format = require("pg-format");

exports.selectArticles = async (orderBy = 'desc') => {
    const upperOrderBy = orderBy.toUpperCase();
    const validOrderBys = ['ASC', 'DESC'];
    if(!validOrderBys.includes(upperOrderBy)){
        return Promise.reject({status: 400, msg:'Bad request!'})
    } else {
        let insertQuery = `SELECT articles.author, 
                                articles.title,
                                articles.article_id, 
                                articles.topic, 
                                articles.created_at, 
                                articles.votes, 
                                COUNT(comments.article_id) AS comment_count
        FROM comments
        FULL OUTER JOIN articles
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at ${upperOrderBy};`;
        const {rows} = await db.query(insertQuery);
        return rows;
    }
}

exports.selectArticleById = async (targetArticleId) => {
    
    if(!Number.isInteger(Number(targetArticleId))){
        return Promise.reject({status: 400, msg:'Bad request!'})
    } else{
        const articleQuery = 'SELECT * FROM articles WHERE article_id = $1;'
        const {rows: article} = await db.query(articleQuery,[targetArticleId]);
        const commentQuery = 'SELECT * FROM comments WHERE article_id = $1;'
        const {rows: comments} = await db.query(commentQuery,[targetArticleId]);
        if(article.length === 0){
            return Promise.reject({status:404, msg:'Article not found!'});
        } else {
            article[0].comment_count = comments.length;
            return article;
        }
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
        const commentQuery = 'SELECT * FROM comments WHERE article_id = $1;'
        const {rows: comments} = await db.query(commentQuery,[targetArticleId]);

        if(article.length === 0){
            return Promise.reject({status:404, msg:'Article not found!'});
        } else {
            article[0].comment_count = comments.length;
            return article;
        }
    }
}

exports.selectCommentsByArticleId = async (targetArticleId) => {
    if(!Number.isInteger(Number(targetArticleId))){
        return Promise.reject({status:400, msg:'Bad request!'})
    } else {
        const articleQuery = 'SELECT * FROM articles WHERE article_id = $1;'
        const {rows: article} = await db.query(articleQuery,[targetArticleId]);
        
        const commentQuery =   `SELECT comment_id, votes, created_at, author, body 
                                FROM comments 
                                WHERE article_id = $1`;
        const {rows: comments} = await db.query(commentQuery,[targetArticleId]);

        if(article.length === 0){
            return Promise.reject({status:404, msg:'Article not found!'});
        } else {
            return comments;
        }
    }
}

exports.addCommentByArticleId = async (targetArticleId, incomingComment) => {
    const votes = 0;
    const created_at = '2020-06-20T07:24:00.000Z';
    const author = incomingComment.username;
    const body = incomingComment.body;
    const article_id = targetArticleId;

    if(!Number.isInteger(Number(targetArticleId))){
        return Promise.reject({status:400, msg:'Bad request!'})
    }

    const {rows: usernames} = await db.query('SELECT username FROM users');
    const validNames = usernames.map(user => user = user.username);
    if(!validNames.includes(author)){
        return Promise.reject({status:400, msg:'Username not found!'});
    }

    if(body.length < 1){
        return Promise.reject({status:400, msg:'Comment not long enough!'});
    }

    const articleQuery = 'SELECT * FROM articles WHERE article_id = $1;'
    const {rows: article} = await db.query(articleQuery,[targetArticleId]);

    if(article.length === 0){
        return Promise.reject({status:404, msg:'Article not found!'});
    }

    const {rows: [insertedQuery]} = await db.query(
        'INSERT INTO comments (votes, created_at, author, body, article_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [ votes, created_at, author, body, article_id,])
    
    return insertedQuery;
}