const request = require("supertest");
const app = require("./src/app");
const Restaurant = require("./models/Restaurant");
const db = require("./db/connection");
const syncSeed = require("./seed");

describe("Method testing", () => {
  beforeAll(async () => {
    // connect to and rebuild the db
    await db.sync({ force: true });
  });
  describe("GET", () => {
    let response;
    let responeArr;
    beforeAll(async () => {
      response = await request(app).get("/restaurants");
      responeArr = JSON.parse(response.text);
    });
    test("returns a status code of 200", async () => {
      expect(response.statusCode).toBe(200);
    });

    test("returns the full array of Restaurants", async () => {
      expect(Array.isArray(responeArr)).toBeTruthy();
    });

    test("returns the correct number of Restaurants", async () => {
      expect(responeArr).toHaveLength(3);
    });

    test("GET/:id returns the correct single Restaurant", async () => {
      const response = await request(app).get("/restaurants/1");
      expect(JSON.parse(response.text)).toEqual(
        expect.objectContaining({
          name: "AppleBees",
          location: "Texas",
          cuisine: "FastFood",
        })
      );
    });
  });

  describe("POST", () => {
    test("POST can create a new Restaurant", async () => {
      const response = await request(app).post("/restaurants").send({
        name: "In'N'Out Burgers",
        location: "San Clemente",
        cuisine: "Fast Food",
      });
      expect(JSON.parse(response.text)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "In'N'Out Burgers",
            location: "San Clemente",
            cuisine: "Fast Food",
          }),
        ])
      );
    });

    test("throw error if fields aren't filled in", async () => {
      const response = await request(app).post("/restaurants").send({
        name: "La Tortilla Burritos",
        location: "San Clemente",
        cuisine: "",
      });
      expect(JSON.parse(response.text).error).toHaveLength(1);
    });

    test("throw error if name is too short or too long", async () => {
      const shortResponse = await request(app).post("/restaurants").send({
        name: "",
        location: "San Clemente",
        cuisine: "French",
      });
      const longResponse = await request(app).post("/restaurants").send({
        name: "This is a way too long restaurant name so it won't be accepted due to it's length",
        location: "San Clemente",
        cuisine: "French",
      });

      expect(JSON.parse(shortResponse.text).error).toHaveLength(2);
      expect(JSON.parse(longResponse.text).error).toHaveLength(1);
    });
  });

  test("PUT can update an exisiting Restaurant", async () => {
    const response = await request(app)
      .put("/restaurants/1")
      .send({ name: "AppleBee", location: "Texas", cuisine: "FastFood" });
    expect(JSON.parse(response.text).name).toEqual("AppleBee");
  });

  test("DELETE can delete a Restaurant", async () => {
    await request(app).delete("/restaurants/1");
    const restaurants = await Restaurant.findAll();
    expect(restaurants).toHaveLength(3);
  });
});
