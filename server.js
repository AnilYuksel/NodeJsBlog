const express = require("express");
const app = express();
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv");
const router = require("./routers/indexRouter");
const bodyParser = require("body-parser");
const path = require('path')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const connectDatabase = require("./middlewares/database/connectDatabase");


app.use(fileUpload())

app.set("view engine", "ejs");

//Environment Variables
dotenv.config({
  path: "./config/config.env",
});

//Mongo Db
connectDatabase();

//auth
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions'
})
app.use(session({
  secret: 'SecretString',
  resave: false,
  saveUninitialized: false,
  store:store
}))
app.use((req,res,next) => {
  res.locals.isAuth = req.session.isLoggedIn
  next()
})

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

//DisplayLogin MiddleWare
app.use((req,res,next)=>{
  const checkLogin = req.session.isLoggedIn
  if(checkLogin){
    res.locals = {
      displayLink: true
    }
  }else{
    res.locals  = {
      displayLink : false
    }
  }
  next()
})


// app.use(errorHandler);

//General Router
app.use("/", router);

//Not Found Page
app.use((req,res,next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found'})
})



//server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});
