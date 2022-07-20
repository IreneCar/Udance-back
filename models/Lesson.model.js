const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lessonsSchema = new Schema({
  teacher: String,
  title: String,
  styles: [String],
  location: String,
  hours: String,
  days: String,
  firstDay: Date,
  lastDay: Date,
  price: Number,
  details: String,
  cohost: [String],
  image: String,
});

module.exports = model("Lesson", lessonsSchema);

//tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],