//jshint esversion:6

//requiring
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

//initialising variables
var filterbySubject = "";
var commentid="";

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyparser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

//storing user data (email and passwords)
const userSchema = {
  email: String,
  password: String
};
const User = new mongoose.model("User", userSchema)


//storing notes information
const noteSchema = {
  yourname: String,
  proffname: String,
  subject: String,
  date: String,
  chapname: String,
  linktitle: String,
  link: String,
  comment:[String]
};

const Note = new mongoose.model("Note", noteSchema)

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/contents", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/information", function(req, res) {
  res.sendFile(__dirname + "/information.html");
});


app.get("/wrong", function(req, res) {
  res.sendFile(__dirname + "/wrong.html");
});

app.get("/connect", function(req, res) {
  res.sendFile(__dirname + "/connect.html");
});

app.post("/information", function(req, res) {

  const yourname = req.body.your_name
  const proffname = req.body.professors_name
  const subject = req.body.subjects
  const date = req.body.date
  const chapname = req.body.chapter_name
  const linktitle = req.body.link_title
  const link = req.body.notes_link


  const note = new Note({
    yourname: yourname,
    proffname: proffname,
    subject: subject,
    date: date,
    chapname: chapname,
    linktitle: linktitle,
    link: link
  })

  note.save();

  res.redirect("/information")
})

app.get("/list", function(req, res) {

  Note.find({
    subject: filterbySubject
  }, function(err, foundItems) {
    res.render("list", {
      subject: filterbySubject,
      newListItems: foundItems
    });

  })


});

app.get("/comment", function(req, res) {
  Note.find({
    _id: commentid
  }, function(err, foundItems) {

    res.render("comment", {
      listTitle: commentid,
      newListItems: foundItems,
    });

  })

});


app.post("/list", function(req, res) {
  console.log(req.body.button)
  filterbySubject = req.body.button
  res.redirect("/list")
});


//comment post request
app.post("/comment", function(req, res) {
  commentid=req.body.button

  res.redirect("/comment")

});


app.post("/", function(req, res) {

  const username = req.body.username
  const password = req.body.password
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) console.log(err);

    else {
      if (foundUser.password === password) {
        res.redirect("/information")
      } else {

        res.redirect("/wrong")
      }
    }

  })

});

app.listen(3000, function() {
  console.log("server is running on port 3000");
});
