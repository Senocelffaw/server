const express = require('express');
const jwt = require("jsonwebtoken");
const dbconnect = require('../db/db.js');

let router = express.Router();

router
    .route('/login')
    .get( async (req,res) =>{
        try{
            let result = await dbconnect.getUser(req.body.username, req.body.password);
            if(result.length === 0){
                return res.json({login: false});
            }
            else{
                result[0].login = true;
                parsedResult = JSON.parse(JSON.stringify(result[0]));
                let accessToken = jwt.sign(parsedResult, process.env.SECRET, { expiresIn: '300s' });
                let refresh = jwt.sign(parsedResult, process.env.SECRET_REFRESH, { expiresIn: '7d'});
                await dbconnect.addKey(parsedResult.user_id, refresh);
                parsedResult.accessToken = accessToken;
                parsedResult.refreshToken = refresh;
                return res.json(parsedResult);
            }
        }catch(e){
            res.sendStatus(500);
        }
    });

router
    .route('/verify')
    .get( authenticateToken, async (req, res) => {
        let user = await dbconnect.getRefresh(req.user.user_id);
        res.json(user);
    });

router
    .route('/logout')
    .post( async (req, res) => {
        const token = req.body.token;
        try{
            let dbToken = await dbconnect.getRefresh(token);

            if(token == null) return res.sendStatus(401);
            if(dbToken[0] == null) return res.sendStatus(403);
            if(token != dbToken[0].refresh_token) return res.sendStatus(403);
            jwt.verify(token, process.env.SECRET_REFRESH, (err, decoded) => {
                if(err) return res.send("invalid todeken");
                uid = decoded.user_id;
            });
            
            await dbconnect.deleteKey(token);

            console.log("token deleted");
            
        }catch(e){
            console.log(e);
        }
    });


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.user = decoded;
        next();
    });
}

module.exports = router;