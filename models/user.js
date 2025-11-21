const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// ❌ REMOVE this line — React is not used in backend
// const { useSyncExternalStore } = require("react");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// ✔ Correct method
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
