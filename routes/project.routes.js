const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Lesson = require("../models/Lesson.model");
const User = require("../models/User.model");

router.get("/profile", (req, res, next) => {
  console.log("me piden el profile");
  User.findById(req.payload._id)
    .populate("receivedLessons")
    .populate("givedLessons")
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

router.get("/profile/gived", (req, res, next) => {
  User.findById(req.payload._id)
    .populate("givedLessons")
    .then((user) => res.json(user.givedLessons))
    .catch((err) => res.json(err));
});

router.get("/profile/received", (req, res, next) => {
  User.findById(req.payload._id)
    .populate("receivedLessons")

    .then((user) => res.json(user.receivedLessons))
    .catch((err) => res.json(err));
});

//  POST /api/projects  -  Creates a new project
router.post("/lessons", (req, res, next) => {
  console.log("lessons");
  const {
    teacher,
    title,
    styles,
    location,
    hours,
    days,
    firstDay,
    lastDay,
    price,
    details,
    cohost,
    image,
  } = req.body;

  Lesson.create({
    teacher,
    title,
    styles,
    location,
    hours,
    days,
    firstDay,
    lastDay,
    price,
    details,
    cohost,
    image,
  })

    .then((newLesson) => {
      return User.findByIdAndUpdate(req.payload._id, {
        $push: { givedLessons: newLesson._id },
      });
    })

    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/lessons", (req, res, next) => {
  Lesson.find()
    .then((allLessons) => res.json(allLessons))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/lessons/:lessonId", (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Lesson.findById(lessonId)

    .then((lesson) => res.status(200).json(lesson))
    .catch((error) => res.json(error));
});

router.post("/lessons/:lessonId/join", (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(req.payload._id)
    .then((userLogged) => {
      if (!userLogged.receivedLessons.includes(lessonId)) {
        User.findByIdAndUpdate(req.payload._id, {
          $push: { receivedLessons: lessonId },
        }).then(() => {});
      }
    })

    .then((lesson) => res.status(200).json(lesson))
    .catch((error) => res.json(error));
});

router.get("/lessons/:lessonId/dropOff", (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(req.payload._id, {
    $pull: { receivedLessons: lessonId },
  })

    .then((lesson) => res.status(200).json(lesson))
    .catch((error) => res.json(error));
});

// PUT  Updates the profile details
router.put('/profile/edit', (req, res, next) => {


	User.findByIdAndUpdate(req.payload._id, req.body, { new: true })
		.then((updatedProfile) => res.json(updatedProfile))
		.catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
// router.put('/projects/:projectId', (req, res, next) => {
// 	const { projectId } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(projectId)) {
// 		res.status(400).json({ message: 'Specified id is not valid' });
// 		return;
// 	}

// 	Project.findByIdAndUpdate(projectId, req.body, { new: true })
// 		.then((updatedProject) => res.json(updatedProject))
// 		.catch((error) => res.json(error));
// });

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
// router.delete('/projects/:projectId', (req, res, next) => {
// 	const { projectId } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(projectId)) {
// 		res.status(400).json({ message: 'Specified id is not valid' });
// 		return;
// 	}

// 	Project.findByIdAndRemove(projectId)
// 		.then(() =>
// 			res.json({
// 				message: `Project with ${projectId} is removed successfully.`
// 			})
// 		)
// 		.catch((error) => res.json(error));
// });

module.exports = router;
