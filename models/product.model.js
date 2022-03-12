const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // store name of the image
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db.getDb().collection("products").findOne({
      _id: prodId,
    });

    if (!product) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }

    // wrong return, because only returning the whole document only from database
    // never converted to an instance based on the Product Class Object
    // and hence doesn't have an id, will cause an error
    // return product;

    // correct return
    // getting the _id based on the instance of the Product Class Object
    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    // map method create a new array and then populate the existing value we pass to the parameter
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    // checking whether we have an id that already stored before in database, if we have, we just update it
    // OR
    // if we don't have the id which means we create a new product
    if (this.id) {
      // updating the database
      const productId = new mongodb.ObjectId(this.id);
      // check if we have image on the server, if we have leave it
      // and check whether user updating image or not, if user updating the image it will override image value in database to be a null/undefined value
      // and it will store it into database, would be nice if we delete it and it will gone entirely :)
      // if user did not updating the image, at $set line 79, will simply don't have the image and hence mongoDB won't even try to update the image field
      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  }
}

module.exports = Product;
