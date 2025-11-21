
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

//const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");   // <-- IMPORTANT FIX
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controller/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });
const axios = require("axios");


router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,
    upload.single('listing[image]'),validateListing,
    wrapAsync(listingController.createListing)
  );
   




router.get("/new", isLoggedIn, listingController.renderNewForm);






router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;


/*
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));


//show

router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({path :"reviews",populate :{path : "author", strictPopulate: false 
     },}).populate("owner");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
console.log(listing);
  res.render("listings/show.ejs", { listing });
}));

*/

// ---------- EDIT ----------





