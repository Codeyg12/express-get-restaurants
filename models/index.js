const Item = require("./Item");
const Menu = require("./Menu");
const Restaurant = require("./Restaurant");

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

Menu.belongsToMany(Item, { through: "MenuItems" });
Item.belongsToMany(Menu, { through: "MenuItems" });

module.exports = {
  Restaurant,
  Menu,
  Item,
};
