const mongoose = require("mongoose");
const Review = require("./review");   // <-- FIXED: Correct import

const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: Number,
  location: String,
  country: String,

  // ⭐ reviews field correctly added
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    default: [77.2090, 28.6139] // fallback
  }
}
,
});

// ⭐ Middleware to delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);



/*const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;


const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    
  },
  description: String,
  image: {
  filename:String,
   url:String
  }, 
    
  
  price: Number,
  location: String,
  country: String,
reviews:[
{
type: Schema.Types.ObjectId,
ref:"Review"
}
]
});

listingSchema.post("findOneAndDelete", async (listing) => {     //post mongose middleware
if (listing) {
await Review.deleteMany({_id: { $in: listing.reviews } });
}});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


*/