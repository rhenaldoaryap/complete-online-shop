const Order = require("../models/order.model");
const User = require("../models/user.model");

function getOrders(req, res) {
  res.render("customer/orders/all-orders");
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    // res.locals.uid we get from check-auth middleware
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  // resetting the cart session to null after user click the buy button
  req.session.cart = null;

  res.redirect("/orders");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
