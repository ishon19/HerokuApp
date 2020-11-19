const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("Connecting to", url, typeof url);

mongoose
  .connect(url, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) => console.log("error connecting to the mongoDB:\n", error));

const noteSchema = new mongoose.Schema({
  content: { type: String, minlength: 5, required: true },
  date: {type: Date, required: true},
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
