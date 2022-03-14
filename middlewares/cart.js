const Cart = require("../models/cart.model");

const initializeCart = (req, res, next) => {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    // req.session.cart => will be create automatically when user first time visit our page and store it to database in the session collection
    // items we fetch from the Cart Class constructor
    // and if the session created, that session will be stored and help us to store the amount of items that already add to the cart
    cart = new Cart(req.session.cart.items);
  }

  res.locals.cart = cart;

  next();
};

module.exports = initializeCart;
