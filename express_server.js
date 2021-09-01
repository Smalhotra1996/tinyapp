const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();

const port = 8080; //default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
//Set ejs as the view engine
app.set("view engine" , "ejs");



const urlDatabase ={
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}


app.get ("/" ,(req,res) =>{
  res.send("Hello");

});
//filling Out the urls_index.ejs Template
app.get("/urls",(req,res) =>{
  const username= req.cookies["username"];
  const templateVars = {urls : urlDatabase, username};
  res.render("urls_index" ,templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls",(req,res)=>{
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.params.longURL;
  console.log(req.body);
  res.redirect(`/urls/${shortURL}`);

});

app.post("/login",(req,res)=>{
  console.log(req.cookies);
  res.cookie("username", req.body.username);
  console.log(req.cookies);
  console.log(req.body);
  res.redirect("/urls");
});

app.post("/logout" ,(req,res)=>{
  res.clearCookie('username');
  res.redirect("/urls");

});



//added shortURL using : and stored it into req.params
app.get("/urls/:shortURL", (req,res)=>{
  if (urlDatabase[req.params.shortURL]){
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]  };
  res.render ("urls_show", templateVars);
  }
  else{
    res.send("Url does not exist")
  }
 // console.log(req.params);
  
});

app.post ("/urls/:shortURL/delete",(req,res) =>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");

});

app.get("/urls/:shortURL/Update", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id" , (req,res) =>{
   urlDatabase[req.params.id] = req.body.createURL;
   console.log(urlDatabase);
   console.log(req.body.createURL);
   res.redirect("/urls");
 
});
app.get("/u/:shortURL" , (req,res) =>{
  res.redirect(urlDatabase[req.params.shortURL]);

});
// app.get("/urls.json", (req,res) =>{
//   res.json(urlDatabase);
// });

app.get("/hello", (req,res) =>{
  res.send("<html><body><h1>Hello</h1><b>World</b></body>\n");

});

app.get("/set",(req,res) =>{
  const a = 2;
  res.send(`a = ${a}`);
});

app.get("/fetch",(req,res)=>{
  res.send(`a = ${a}`);
});

app.listen(port , () => {
  console.log(`Example app listening on port ${port}!`);

});

