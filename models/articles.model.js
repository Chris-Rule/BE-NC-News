const db = require("../db/connection")
const format = require("pg-format");

exports.selectArticles = async (sortBy = 'created_at' ,orderBy = 'desc', in_topic) => {
    const upperOrderBy = orderBy.toUpperCase();
    const lowerSortBy = sortBy.toLowerCase();
    const validOrderBys = ['ASC', 'DESC'];
    let topicFilter = '';

    if(in_topic){
        const lowerTopic = in_topic.toLowerCase();
        const {rows: topics} = await db.query('SELECT * FROM topics;');
        const validTopics = topics.map(topic => topic = topic.slug.toLowerCase());
        if(!validTopics.includes(lowerTopic)){
            return Promise.reject({status: 400, msg:'Bad request!'})
        }
        topicFilter = `WHERE articles.topic = '${lowerTopic}'`
    }

    const {rows: articles} = await db.query('SELECT * FROM articles LIMIT 1;');
    const validSortBys = Object.keys(articles[0]).map(title => title.toLowerCase());
    validSortBys.push('comment_count');
    
    if(!validSortBys.includes(lowerSortBy)){
        return Promise.reject({status: 400, msg:'Bad request!'})
    } 

    if(!validOrderBys.includes(upperOrderBy)){
        return Promise.reject({status: 400, msg:'Bad request!'})
    } 

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
    ${topicFilter}
    GROUP BY articles.article_id
    ORDER BY ${lowerSortBy} ${upperOrderBy};`;
    const {rows} = await db.query(insertQuery);
    return rows;
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
    const author = incomingComment.username;
    const body = incomingComment.body;
    const article_id = targetArticleId;


    if(!incomingComment.username || !incomingComment.body){
        return Promise.reject({status:400, msg:'Bad request!'})
    }

    if(!Number.isInteger(Number(targetArticleId))){
        return Promise.reject({status:400, msg:'Bad request!'})
    }

    const {rows: usernames} = await db.query('SELECT username FROM users');
    const validNames = usernames.map(user => user = user.username);
    if(!validNames.includes(author)){
        return Promise.reject({status:404, msg:'Username not found!'});
    }

    const articleQuery = 'SELECT * FROM articles WHERE article_id = $1;'
    const {rows: article} = await db.query(articleQuery,[targetArticleId]);

    if(article.length === 0){
        return Promise.reject({status:404, msg:'Article not found!'});
    }

    const {rows: [insertedQuery]} = await db.query(
        'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
        [ author, body, article_id,])
    
    return insertedQuery;
}