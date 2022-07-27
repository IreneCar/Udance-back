const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary =require("../config/cloudinary")
const upload =require("../config/multer")
const nodemailer = require ("nodemailer")
const Lesson = require("../models/Lesson.model");
const User = require("../models/User.model");

router.get("/profile", (req, res, next) => {

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



//  GET /api/projects/:projectId -  Retrieves a specific project by id


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
router.put('/profile/edit',upload.single('image'),async  (req, res, next) => {
  try{console.log("entro en edit")
 

 
  const { name, description,danceStyles,existingId,existingUrl } = req.body;
  
  let imageUrl;
  let imageId;
  if(existingId){

    if (req.file) {
      let user = await User.findById(req.payload._id);
      await cloudinary.uploader.destroy(user.imageId);
      const result=await cloudinary.uploader.upload(
        req.file.path,{upload_preset:"uploaded"})
      imageUrl = result.secure_url;
      imageId=result.public_id
    } else { 
      imageUrl = existingUrl;
      imageId = existingId
      }
    }
  else{
    if (req.file) {
      
      
      const result=await cloudinary.uploader.upload(
        req.file.path,{upload_preset:"uploaded"})
       
      imageUrl = result.secure_url;
      imageId=result.public_id
      
    } else { 
      imageUrl = existingUrl;
     
      }
  }


  const user =await User.findByIdAndUpdate(req.payload._id,{name,description,danceStyles,imageId,imageUrl},{new:true})
  
  res.json(user); // <=== added
} catch (err) {
  console.log(err)
}
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
