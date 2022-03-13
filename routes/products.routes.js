const express = require("express");

const productControllers = require("../controllers/products-controller");

const router = express.Router();

router.get("/products", productControllers.getAllProducts);

router.get("/products/:id", productControllers.getProductDetails);

module.exports = router;
