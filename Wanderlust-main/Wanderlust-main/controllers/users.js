const User = require("../models/user")

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email});
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);  
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Worderlust!");
            res.redirect("/listings")
        })
       
    } 
  catch(e){
    req.flash("error",e.message);
    res.redirect("/signup")
  }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);   
    // res.redirect(res.locals.saveRedirectUrl);   
}

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect('/listings');  
    })
}