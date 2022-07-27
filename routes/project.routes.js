const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lesson = require("../models/Lesson.model");
const User = require("../models/User.model");
const nodemailer = require ("nodemailer")
let aws = require("@aws-sdk/client-ses");
let { defaultProvider } = require("@aws-sdk/credential-provider-node");


router.get("/lessons", (req, res, next) => {
console.log("me piden lessons")
    Lesson.find()
      .then((allLessons) => res.json(allLessons))
      .catch((err) => res.json(err));
  });


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

  router.post("/send-email", (req, res, next) => {
   
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });
  
  var mailOptions={
    from:`"Mail prueba"<iron@iron.com>`,
    to:"rubengh88@gmail.com,iron@iron.com",
    subject:"enviado desde nodemailer",
    text:"Mensaje enviado"
  }
  
  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      res.status(500).send(error.message)
    }else{
      console.log("mail enviado")
      res.status(200).jsonp(req.body)
    }
  })
  
   
  });


module.exports = router;