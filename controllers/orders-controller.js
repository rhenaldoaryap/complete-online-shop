const Order = require("../models/order.model");
const User = require("../models/user.model");

// this function for all regular users
// each of user must see their own orders, not the other order
async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", { orders: orders });
  } catch (error) {
    next(error);
  }
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
