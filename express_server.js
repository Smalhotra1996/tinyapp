const express = require("express");
const app = express();
const port = 8080; //default port 8080

const urlDatabase ={
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get ("/" ,(req,res) =>{
  res.send("Hello");

});

app.get("/urls.json", (req,res) =>{
  res.json(urlDatabase);
});

app.get("/hello", (req,res) =>{
  res.send("<html><body><h1>Hello</h1><b>World</b></body>\n");

});

app.listen(port , () => {
  console.log(`Example app listening on port ${port}!`);

});