const express = require("express");
const router = express.Router();

//ALL BOOKS
router.get("/", (req, res) => {
  res.redirect("/books");
});

module.exports = router;
