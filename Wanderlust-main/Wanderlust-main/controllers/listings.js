const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show", { listing });
  }

  module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let fileName = req.file.filename;
  // console.log(url,"..",fileName)

    // let {title,description,image,price,country,location} = req.body;
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,fileName};
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
  }

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    console.log(listing.image.url);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
    console.log(originalImageUrl);
    res.render("listings/edit", { listing, originalImageUrl });
  }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let fileName = req.file.filename;
    listing.image = {url,fileName};
    await listing.save();
   }
    
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing  = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  }
