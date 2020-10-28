const express = require("express");
const config = require("./config");
const app = express();
const moviesRoute = require("./routes/movies");
const userRoute = require("./routes/user");
const MongoClient = require('mongodb').MongoClient;

const uri = config.CONNECTION_STRING;
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

client.connect(err => {
    if(err) {
        console.log(err);
       // client.close();
        return;
    }

  const db = client.db("moviesdb");
  
  app.use("/movies",moviesRoute(db));
  app.use("/user",userRoute(db));
 // client.close();
});




app.listen(3000, () => {
    console.log(`Server started on port`);
});