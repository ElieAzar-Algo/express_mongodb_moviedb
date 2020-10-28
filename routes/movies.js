const express = require("express");
const router = express.Router();
const {ObjectID} = require("mongodb"); //<<ES6 const ObjectID = require("express").ObjectID; << ES5 
const bodyParser = require("body-parser");

const auth = require("../auth");

let db = null;


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//get all
router.get("/", (req, res) => {
    //TODO sanitize

    const collection = db.collection("movies");
    collection.find({},(err, result)=>{
        if (err) {
            return res.status(500).json({status:500,message:err,error:true});
        }
        console.log(typeof result);

        let sorting = req.query.sort;
        if(sorting){
            if(sorting === "by-date") result.sort({year:1});
            if(sorting === "title") result.sort({title:1});
            if(sorting === "rating") result.sort({rating:-1});
        }
        
        let arrayResult = result.toArray();

        arrayResult.then(
            (resultArray) =>{
                return res.status(200).json({status:200,message:"data are found",data:resultArray});
            })
      });
}
    );

/////////////Get By ID/////////////
router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    const details = { '_id': ObjectID(id) };

    db.collection('movies').findOne(details, (err, item) => {
        //handle not existing movie
        console.log(err)
        console.log(item)
        if (err) { res.status(404).json({ status: 404, error: true, message: `the movie ${id} does not exist` }); }
        else {
            res.status(200).json({
                status: 200,
                data: item
            });
        }
    });
});

router.post("/", auth,(req, res) => {
//TODO sanitize and validate the data 


   let {title , rating , year} = req.body;
   
    //handle missing feild
    if (title == undefined || year == undefined || !(year > 1800 && year < 2021)) {
        res.status(403).json({ status: 403, error: true, message: 'you cannot create a movie without providing a title and a year' });
        return;
    }

   db.collection("movies").insertOne({title:title,year:year,rating:rating},(err,result)=>{
    if (err) res.status(500).json({ status: 500, error: true, message: "internal error" });
    res.status(201).json({ status: 201, data: result["ops"][0] });
   });
    
});

router.put("/:id", auth, (req, res) => {
    const id = ObjectID(req.params.id);
    const {title, rating, year} = req.body;

    const updatedData = {};

    if(title) updatedData["title"] = title;
    if(year) updatedData["year"] = year;
    if(rating) updatedData["rating"] = rating;

    db.collection("movies").update({"_id":id},updatedData,(err,result)=>{
        if(err){}
        res.redirect("/");
    });
});

router.delete("/:id",auth, (req, res) => {
    const id = ObjectID(req.params.id);
    db.collection("movies").deleteOne({_id: id},(err,res)=>{
        if(err){}//error
        res.status(200);
        res.redirect("/");
    });
});

module.exports = (_db) => {
    db = _db;
    return router;
}
