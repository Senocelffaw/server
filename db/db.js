const sql = require('mysql');
const config = require('config').get('development.database');

const pool = sql.createPool(config);

let dbconnect = {};

dbconnect.getUser = (username, password) => {
    var query = "SELECT user_id, username FROM user WHERE username = ? AND password = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [username, password] , (err, result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        });
    });
};

dbconnect.getRefresh = (refresh) => {
    var query = "SELECT refresh_token FROM token WHERE refresh_token = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [refresh] , (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

dbconnect.addKey = (uid, token) => {
    var query = "INSERT INTO token(user_id, refresh_token) VALUES(?,?)";
    return new Promise((resolve, reject) => {
        pool.query(query, [uid, token] , (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};


dbconnect.deleteKey = (token) => {
    var query = "DELETE FROM token WHERE refresh_token = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [token] , (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

dbconnect.getPortItem = (number) => {
    var query = "SELECT * FROM portfolio_item WHERE item_id <= ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [number] , (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};



module.exports = dbconnect;