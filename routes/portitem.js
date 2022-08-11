const express = require('express');
const dbconnect = require('../db/db.js');

let router = express.Router();

router
    .route('/:number')
    .get( async (req,res) =>{
        try{
            let result = await dbconnect.getPortItem(req.params.number);
            if(result.length === 0){
                return res.json({login: false});
            }
            else{
                return res.json(result);
            }
        }catch(e){
            res.sendStatus(500);
        }
    });


module.exports = router;