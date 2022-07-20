const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  image:{String},
  desctription:{String},
  danceStyles:[String],
  receivedLessons:[{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  givedLessons:[{ type: Schema.Types.ObjectId, ref: "Lesson" }]

});

module.exports = model("User", userSchema);
