const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

app.use(express.json())
app.use(express.urlencoded())

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});
 
app.get("/restaurant/:id", async (req, res) => {
  const id = req.params.id;
  const restaurant = await Restaurant.findByPk(id);
  res.json(restaurant);
});

app.post("/restaurants", async (req, res) => {
    const newRestaurant = await Restaurant.create(req.body)
    res.send(newRestaurant)
})

app.put("/restaurant/:id", async (req, res) => {
    const updatedRestaurant = await Restaurant.findByPk(req.params.id)
    await updatedRestaurant.update(req.body)
    await updatedRestaurant.save()
    res.send(updatedRestaurant)
})

app.delete("/restaurant/:id", async (req, res) => {
    const deletedRestaurant = await Restaurant.findByPk(req.params.id)
    await deletedRestaurant.destroy()
    res.send(deletedRestaurant)
})

module.exports = app;
