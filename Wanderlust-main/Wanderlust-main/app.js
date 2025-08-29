if(process.env.NODE_ENV != "production")
{
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./router/listing.js")
const reviews = require("./router/review.js");
const userRouter = require("./router/user.js");

const { date } = require("joi");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to Database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl); 
  // await mongoose.connect(mongoUrl);
}

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 60 * 60
})
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store: store,
  secret :  process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true
  }
} 

// ROOT ROUTE
app.get("/", (req, res) => {
  // res.send("Hi.. i am Root");
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

  // app.get("/demouser", async(req,res)=>{
  //   let fakeUser = new User({
  //     email : "student@gmail.com",
  //     username : "delta-student"
  //   });
  //  let registeredUser = await User.register(fakeUser,"helloworld");
  //  res.send(registeredUser);

  // })

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)
app.use("/",userRouter)

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not Found!"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode = 500, messege = "something went wrong" } = err;
//   res.status(statusCode).send(messege);
// });

app.listen(8080, () => {
  console.log("app is listening on port 8080");
});
