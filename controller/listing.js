const Listing = require("../models/listing");
const Review=require("../models/review");
const axios = require("axios");

module.exports.index=  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm= (req, res) => {

  res.render("listings/new.ejs") };


  module.exports.showListing= async (req, res) => {
      const { id } = req.params;
  
      const listing = await Listing.findById(id)
          .populate({
              path: "reviews",
              populate: { path: "author" }
          })
          .populate("owner");
  if (!listing) {
          req.flash("error", "Listing not found!");
          return res.redirect("/listings");
      }
  
      res.render("listings/show.ejs", { listing });
  };



  module.exports.createListing = async (req, res) => {
    const { location } = req.body.listing;

    // 1️⃣ GEOENCODING using Nominatim
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    const response = await axios.get(geoUrl);

    const coords = response.data[0]
        ? [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)]
        : [77.2090, 28.6139]; // fallback Delhi

    // 2️⃣ IMAGE upload
    let url = req.file.path;
    let filename = req.file.filename;

    // 3️⃣ CREATE LISTING
    const listing = new Listing(req.body.listing);

    listing.owner = req.user._id;
    listing.image = { url, filename };

    // 4️⃣ ADD GEOMETRY
    listing.geometry = {
        type: "Point",
        coordinates: coords
    };

    // 5️⃣ SAVE
    await listing.save();

    // 6️⃣ SHOW IN TERMINAL
    console.log("Saved Geometry:", listing.geometry);

    req.flash("success", "New listing created!");
    res.redirect(`/listings/${listing._id}`);
};




  module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
  
    const listing = await Listing.findById(id);
  
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
  
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/,w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  };

  module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
   if(typeof req.file !=="undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
  }
    req.flash("success"," listing updated!");
    res.redirect(`/listings/${id}`);
  };



  module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
  
    const listing = await Listing.findById(id);
  
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
  
    // Delete its reviews
    if (listing.reviews && listing.reviews.length > 0) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
  
    // Delete listing
    await Listing.findByIdAndDelete(id);
  
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  };





 