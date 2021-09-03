const express = require("express");
var cookieParser = require('cookie-parser')
const app = express();

const port = 8080; //default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
//Set ejs as the view engine
app.set("view engine" , "ejs");

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const getuser = function(email){
    for(const user in users){
     // console.log(`example : ${users[user].email}` );
      if (email === users[user].email){
       return user;

      }
    }
    return null;
}
    
     // if (user.email)
    





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
  const templateVars = {urls : urlDatabase, user: users[username]};
  res.render("urls_index" ,templateVars);
});

app.get("/urls/new", (req, res) => {
  const username= req.cookies["username"];
  const templateVars = { user: users[username]};
  res.render("urls_new" ,templateVars);
});

app.post("/urls",(req,res)=>{
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.params.longURL;
  console.log(req.body);
  res.redirect(`/urls/${shortURL}`);

});

//registration

app.get("/register", (req, res) => {
  const username = req.cookies["username"];
  const templateVars = { user: users[username], urls: urlDatabase };
  res.render("urls_registration", templateVars);
});


//post register

app.post("/register",(req,res) => {

  
  const userid = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const newuser = {
    id : userid,
    email : email,
    password : password
  }

  if(email === "" && password === "") {
    const templateVars = { message: "Missing both email and password!", user : null};
    
    res.status(400).render("urls_error", templateVars);
    return;
  }

  if (email === ""){
    const templateVars = { message: "Missing email", user : null};
    
    res.status(400).render("urls_error", templateVars);
    return;
  }
  
  if( password === "") {
    const templateVars = { message: "Missing password", user : null};
    
    res.status(400).render("urls_error", templateVars);
    return;
  }

  //let isemailuser = null;


    //   isemailuser = user;
    //   const templateVars = { message: "Email already exist!",};
    
    // res.status(400).render("urls_error", templateVars);
    
  


  if(email === "" && password === "") {
    console.log( "Missing both email and password!");
    
    res.status(400);
    return;
  }


  if( password === "") {
    console.log ("Missing password");
    
    res.status(400);
    return;
  }

 
  if (email === ""){
    console.log("Missing email");
    
    res.status(400);
    return;
  }

  if (!getuser(email)){
     console.log("Email exist") ;
    
    res.status(400);
    return;
  }

    //req.session.user_id = userid;
    //res.redirect('/urls')

  users[userid] = newuser;
  //console.log(users);
  res.cookie("username",userid);
  //console.log(req.cookies["username"]);
  
  res.redirect("/urls");
  
  });
  




app.get("/login", (req,res) => {
  
  const username = req.cookies["username"];
 
  const templateVars = { user: users[username], urls: urlDatabase };
  res.render("urls_login", templateVars);
  
});

app.post("/login",(req,res) => {
  if(req.body.email === "" && req.body.password === ""){
    const templateVars = { message: "Missing both email and password!", user : null};
    
    res.status(400).render("urls_error", templateVars);
    return;
  }

  if(req.body.email === ""){
    const templateVars = { message: "Missing email", user : null};
    
    res.status(400).render("urls_error", templateVars);
    return;
  }

  if(req.body.password === ""){
    const templateVars = { message: "Missing password", user : null};
   
    res.status(400).render("urls_error", templateVars);
    return;
  }

});


const authenticateUser = function (email, password, users) {
  
  let user;
  for (const ID in users) {
    if (users[ID].email === email) {
      user = users[ID];
    }
  }
 
  if (user) {
    
    if (bcrypt.compareSync(password, user.password)) {
      console.log("user: ", user);
      return { user, error: null };
    }
    return { user: null, error: "Bad password" };
  }
  return { user: null, error: "Bad email" };

};


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
