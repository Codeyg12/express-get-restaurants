const express = require("express");
const { Restaurant, Menu, Item } = require("../models");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  const restaurants = await Restaurant.findAll({
    include: Menu,
    include: [
      {
        model: Menu,
        include: [
          {
            model: Item,
          },
        ],
      },
    ],
  });
  res.json(restaurants);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const restaurant = await Restaurant.findByPk(id);
  res.json(restaurant);
});

router.post(
  "/",
  [
    check("name").notEmpty().trim().isLength({ min: 10, max: 30 }),
    check("location").notEmpty().trim(),
    check("cuisine").notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
    } else {
      await Restaurant.create(req.body);
      const restaurants = await Restaurant.findAll();
      res.send(restaurants);
    }
  }
);

router.put("/:id", async (req, res) => {
  const updatedRestaurant = await Restaurant.findByPk(req.params.id);
  await updatedRestaurant.update(req.body);
  res.send(updatedRestaurant);
});

router.delete("/:id", async (req, res) => {
  const deletedRestaurant = await Restaurant.findByPk(req.params.id);
  await deletedRestaurant.destroy();
  res.send(deletedRestaurant);
});

module.exports = router;
