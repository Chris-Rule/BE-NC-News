const db = require("../db/connection")

exports.removeCommentById = async (comment_id) => {
    let deleteQuery = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
    const  rows  = await db.query(deleteQuery,[comment_id]);
    if(rows.rowCount === 0){
        return Promise.reject({status: 404, msg:'Not found!'})
    }
}