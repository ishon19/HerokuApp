const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returedObject) => {
    returedObject.id = returedObject._id.toString();
    delete returedObject._id;
    delete returedObject.__v;
    delete returedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
