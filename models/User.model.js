const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type:String,
  default:"https://res.cloudinary.com/dmfu7z6cw/image/upload/v1658910310/uploaded/tx6buoney7yph4hapkqk.jpg" },
  imageId:{String},
  description: { String },
  danceStyles: [String],
  receivedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  givedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

module.exports = model("User", userSchema);
