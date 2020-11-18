const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as well");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ishon:${password}@cluster0.ecj5l.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useFindAndModify: true,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

Note.find({}).then((result) => {
  result.forEach((note) => console.log(note));
  mongoose.connection.close();
});

/* const note = new Note({
  content: "This is another note",
  date: new Date(),
  important: true,
});

note.save().then((result) => {
  console.log("Note saved");
  mongoose.connection.close();
}); */
