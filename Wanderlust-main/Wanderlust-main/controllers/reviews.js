const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
      let newReview =  new Review (req.body.review);
     newReview.author = req.user._id;
    //  console.log(newReview);
      listing.reviews.push(newReview._id);
      await newReview.save();
      await listing.save();
      // console.log("new review saved");
      // res.send("new review saved");
      let {id} = req.params;
      req.flash("success","New Review Created");
       res.redirect(`/listings/${id}`);
  }

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
  }