const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  static findById(userId) {
    const uid = mongodb.ObjectId(userId);

    // second parameter is projection
    // projection means, we can filter what data we want to get and what data we don't want to get
    // projection will define as a second parameter, and inside of second parameter, we pass the configure we want to
    // password: 0 means, we want to exclude the password from database, so we don't fetch the password field from database
    // password: 1 vice versa, we wanto to include the password from database
    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existAlready() {
    const existingUser = await this.getUserWithSameEmail();
    return existingUser ? true : false; // check this one if failed
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
