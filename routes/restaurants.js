const express = require("express")
const Restaurant = require("../models/Restaurant")
const router = express.Router();

router.get("/", async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const restaurant = await Restaurant.findByPk(id);
  res.json(restaurant);
});

router.post("/", async (req, res) => {
  const newRestaurant = await Restaurant.create(req.body);
  res.send(newRestaurant);
});

router.put("/:id", async (req, res) => {
  const updatedRestaurant = await Restaurant.findByPk(req.params.id);
  await updatedRestaurant.update(req.body);
  await updatedRestaurant.save();
  res.send(updatedRestaurant);
});

router.delete("/:id", async (req, res) => {
  const deletedRestaurant = await Restaurant.findByPk(req.params.id);
  await deletedRestaurant.destroy();
  res.send(deletedRestaurant);
});

module.exports = router;
