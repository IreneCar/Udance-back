const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");
const nodemailer = require("nodemailer");
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
    .populate({
      path: "givedLessons",
      populate: {
        path: "teacher",
      },
    })
    .then((user) => {
      res.json(user.givedLessons);
    })
    .catch((err) => res.json(err));
});

router.get("/profile/received", (req, res, next) => {
  User.findById(req.payload._id)
  .populate({path:"receivedLessons",
  populate:{
    path:"teacher"
  }})

    .then((user) => res.json(user.receivedLessons))
    .catch((err) => res.json(err));
});

//  POST /api/projects  -  Creates a new project
router.post("/lessons", (req, res, next) => {
  const {
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


  teacher = req.payload._id;

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

//  GET /api/projects/:projectId -  Retrieves a specific lesson by id

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
        }).then(() => {
          Lesson.findByIdAndUpdate(lessonId, {
            $push: { students: req.payload._id },
          }).then(() => {});
        });
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
    .then(() => {
      Lesson.findByIdAndUpdate(lessonId, {
        $pull: { students: req.payload._id },
      }).then((lesson) => res.status(200).json(lesson));
    })

    .catch((error) => res.json(error));
});

// PUT  Updates the profile details
router.put("/profile/edit", upload.single("image"), async (req, res, next) => {
  try {
    const { name, description, danceStyles, existingId, existingUrl } =
      req.body;

    let imageUrl;
    let imageId;
    if (existingId) {
      if (req.file) {
        let user = await User.findById(req.payload._id);
        await cloudinary.uploader.destroy(user.imageId);
        const result = await cloudinary.uploader.upload(req.file.path, {
          upload_preset: "uploaded",
        });
        imageUrl = result.secure_url;
        imageId = result.public_id;
      } else {
        imageUrl = existingUrl;
        imageId = existingId;
      }
    } else {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          upload_preset: "uploaded",
        });

        imageUrl = result.secure_url;
        imageId = result.public_id;
      } else {
        imageUrl = existingUrl;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.payload._id,
      { name, description, danceStyles, imageId, imageUrl },
      { new: true }
    );

    res.json(user); 
  } catch (err) {
    console.log(err);
  }
});

router.post("/profile/:lessonId/send-email", (req, res, next) => {
  const { lessonId } = req.params;

  let receivers = ["rubengh88@gmail.com"];

  Lesson.findById(lessonId)
    .populate("students")
    .then((lesson) => {
      lesson.students.forEach((student) => {
        receivers.push(student.email);
      });
    })
    .then(() => {
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.PASSWORD, 
        },
      });

      User.findById(req.payload._id).then((user) => {
        receivers.forEach((receiver) => {
          var mailOptions = {
            from: `${user.name}<iron@iron.com>`,
            to: `${receiver}`,
            subject: "enviado desde nodemailer",
            text: `${req.body.message}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              res.status(500).send(error.message);
            } else {
              console.log("mail enviado");
              res.status(200).jsonp(req.body);
            }
          });
        });
      });
    });
});



router.delete("/profile/:lessonId/delete", (req, res, next) => {
  const { lessonId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    res.status(400).json({ 
      message: "Specified id is not valid" });
    return;
  }
 

Lesson.findById(lessonId)
.populate("students")
.then((lesson)=>{
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  lesson.students.forEach((student)=>{
    
    var mailOptions = {
      from: `"Dancemy"<iron@iron.com>`,
      to: `${student.email}`,
      subject: "Class eliminated",
      text: `Your ${lesson.title} has been eliminated,
      please check your profile`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("mail enviado");
        ;
      }})

    
  })


})





User.updateMany({ receivedLessons: `${lessonId}` },
{$pull: { receivedLessons: lessonId }}
)
 
  .then(()=>{
    User.findByIdAndUpdate(req.payload._id, {
      $pull: { givedLessons: lessonId },
    }).then(() => {
      Lesson.findByIdAndRemove(
        lessonId,(error,deletedLesson)=>{
          if(!error){
            res.json(deletedLesson)
          }else{res.json(error)}
        })
    
    })

    });
  

})

module.exports = router;
