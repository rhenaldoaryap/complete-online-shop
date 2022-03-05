const path = require("path");

const express = require("express");
const authRoutes = require("./controllers/auth-controller");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(authRoutes);

app.listen(3000);
