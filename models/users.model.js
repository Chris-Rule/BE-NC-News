const db = require("../db/connection")

exports.selectUsers = async () => {
    let insertQuery = `SELECT * FROM users`;
    const { rows } = await db.query(insertQuery);
    return rows;
}

exports.selectUserByUsername = async (username) => {

    const usernameQuery = 'SELECT * FROM users WHERE username = $1;'
    const {rows:user} = await db.query(usernameQuery,[username]);

    if(user.length === 0){
        return Promise.reject({status:404, msg:'User not found!'});
    } else {
        return user;
    }
}