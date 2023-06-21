//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/Bookstoredata", {useNewUrlParser: true});

const Itemschema = {
  title: String,
  content: String
};

const Item = mongoose.model("Item", Itemschema);

///////////////////////////////////Requests Targetting all Items////////////////////////

app.route("/Items")

.get(function(req, res){
  Item.find(function(err, foundItems){
    if (!err) {
      res.send(foundItems);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newItem = new Item({
    title: req.body.title,
    content: req.body.content
  });

  newItem.save(function(err){
    if (!err){
      res.send("Successfully added a new Item.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Item.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all Items.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Item////////////////////////

app.route("/Items/:ItemTitle")

.get(function(req, res){

  Item.findOne({title: req.params.ItemTitle}, function(err, foundItem){
    if (foundItem) {
      res.send(foundItem);
    } else {
      res.send("No Items matching that title was found.");
    }
  });
})

.put(function(req, res){

  Item.update(
    {title: req.params.ItemTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected Item.");
      }
    }
  );
})

.patch(function(req, res){

  Item.update(
    {title: req.params.ItemTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated Item.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Item.deleteOne(
    {title: req.params.ItemTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding Item.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
