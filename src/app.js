const express = require("express");
const app = express();
const restaurantRouter = require("../routes/restaurants");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/restaurants", restaurantRouter);

module.exports = app;
