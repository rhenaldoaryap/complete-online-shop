const express = require("express");

const router = express.Router();

router.get("/product", function (req, res) {
  res.render("customer/products/all-products");
});

module.exports = router;
