const Product = require("../models/product.model");

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product);
  // sending back session to server / database
  res.session.cart = cart;

  res.status(201).json({
    message: "Cart updated!",
    newTotalItems: cart.totalQuantity,
  });
}

module.exports = {
  addCartItem: addCartItem,
};
