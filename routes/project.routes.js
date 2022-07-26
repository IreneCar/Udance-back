const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lesson = require("../models/Lesson.model");
const User = require("../models/User.model");
const nodemailer = require ("nodemailer")


router.get("/lessons", (req, res, next) => {

  Lesson.find()
  .populate("teacher")
    .then((allLessons) => res.json(allLessons))
    .catch((err) => res.json(err));
});

router.get("/lessons/:lessonId", (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    res.status(400).json({ 
      message: "Specified id is not valid" });
    return;
  }

  Lesson.findById(lessonId)
  .populate("teacher")

    .then((lesson) => res.status(200).json(lesson))
    .catch((error) => res.json(error));
});


module.exports = router;
