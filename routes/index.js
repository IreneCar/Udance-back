const router = require("express").Router();

router.get("/", (req, res, next) => {
  console.log("hola")
  res.json("All good in here");
});

module.exports = router;
