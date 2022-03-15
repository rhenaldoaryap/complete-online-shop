const db = require("../data/database");

class Order {
  constructor(cart, userData, status = "pending", date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    this.formattedDate = this.date.toLocaleDateString("en-US", {
      weekday: "short", // Monday, Tuesday and so on
      day: "numeric",
      month: "long", // name of the month
      year: "numeric",
    });
    this.id = orderId;
  }

  // two main job of this method
  // 1. updating an existing order
  // 2. storing the new order
  save() {
    if (this.id) {
      // updating
    } else {
      // store the new order
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      // return it and don't have to use asynchronous because we not do anything thereafter
      // simply will yield promise for us
      return db.getDb().collection("orders").insertOne(orderDocument);
    }
  }
}

module.exports = Order;
