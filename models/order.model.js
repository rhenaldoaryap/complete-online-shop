const mongodb = require("mongodb");

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

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection("orders")
      .find({ "userData._id": uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  // two main job of this method
  // 1. updating an existing order
  // 2. storing the new order
  save() {
    if (this.id) {
      // updating
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
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
