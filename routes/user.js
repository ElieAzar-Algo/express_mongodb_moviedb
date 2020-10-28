const express = require('express'); 
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');

//const app =  express(); << we use it in the index.js not here

// Inside the rroute there is a scific class that will help us in our work "Router"
const router = express.Router();


let db = null;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.post('/login', (req, res) => {
    db.collection("users").findOne(
        {username:req.body.username, password: req.body.password},(err,item)=>{
            if(err) {}//return a message
            //Login succeed
            const token = jwt.sign({ username: req.body.username }, config.JWT_PRIVATE_KEY, {expiresIn: "1h"});
            res.status(200).json({
                message: "login succeed",
                token:token
            }); 
        }   
    );
});


router.post('/signup', (req, res) => {

    //TODO validate sanitize ll user input
   const {username,password} = req.body;

   db.collection("users").insertOne({username:username,password:password},(err,result)=>{
    if (err) return res.status(500).json({ status: 500, error: true, message: "internal error" });
    return res.status(201).json({ status: 201, data: result["ops"][0]});
   });
    
});

module.exports= (_db)=>{
    db = _db;
    return router;
}