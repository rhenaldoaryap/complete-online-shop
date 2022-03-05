const express = require("express");
const authRoutes = require("./controllers/auth-controller");

const app = express();

app.use(authRoutes);

app.listen(3000);
