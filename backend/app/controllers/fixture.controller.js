const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const Fixture = db.fixture;

/* Add new fixture*/
exports.createFixture = async (req, resp, next) => {
  try {
    // multiple creation
    if (req.body && Array.isArray(req.body)) {
      let insertedFixtures = [];
      for (let i = 0; i < req.body.length; i++) {
        if (req.body[i]["homeTeam"] && req.body[i]["awayTeam"]) {
          const fixtureData = new Fixture({
            matchDate: req.body[i]["matchDate"],
            homeTeam: req.body[i]["homeTeam"],
            awayTeam: req.body[i]["awayTeam"],
            league: ObjectId(req.body[i]["league"]),
            user_id: ObjectId(req.body[i].user["createdBy"]),
            compitition: req.body.compitition.map((comp) => ObjectId(comp)),
            shortcode: ObjectId(req.body[i].shortcode),
            createdAt: new Date()
          });
          insertedFixtures.push(req.body[i]);
          await fixtureData.save();
        }
      }
      resp.status(200).json(insertedFixtures);
    } else if (req.body["homeTeam"] && req.body["awayTeam"]) {
      const fixtureData = new Fixture({
        matchDate: new Date(req.body["matchDate"]).toLocaleDateString(),
        homeTeam: req.body["homeTeam"],
        awayTeam: req.body["awayTeam"],
        league: ObjectId(req.body["league"]),
        user_id: ObjectId(req.body.user["createdBy"]),
        shortcode: req.body.shortcode,
        compitition: Array.isArray(req.body.compitition)
          ? req.body.compitition.map((comp) => ObjectId(comp._id))
          : ObjectId(req.body.compitition),
        createdAt: new Date()
      });

      const savedFixture = await fixtureData.save();
      resp.status(200).json(savedFixture);
    }
  } catch (error) {
    next(error);
  }
};

/* GET all fixture listing. */
exports.getAllFixture = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({}).populate([
      "league",
      "homeTeam",
      "awayTeam",
      "user_id"
    ]);
    resp
      .status(200)
      .json(fixture.length > 0 ? fixture : { message: "No fixture found" });
  } catch (error) {
    next(error);
  }
};

/* Get fixture based on id*/
exports.getFixtureById = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({
      _id: ObjectId(req.params.id)
    }).populate(["league", "homeTeam", "awayTeam"]);
    resp.status(200).json(fixture);
  } catch (error) {
    next(error);
  }
};

exports.forShortCode = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({
      shortcode: req.params.shortcode
    }).populate(["league", "homeTeam", "awayTeam"]);
    resp.status(200).json(fixture);
  } catch (error) {
    next(error);
  }
};
exports.forCompitition = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({
      compitition: ObjectId(req.params.compitition)
    }).populate(["league", "homeTeam", "awayTeam"]);
    resp.status(200).json(fixture);
  } catch (error) {
    next(error);
  }
};
/* Edit existing fixture based on id*/
exports.updateFixture = async (req, resp, next) => {
  try {
    if (req.params && req.params.id) {
      let fetchFixture = await Fixture.findOne({
        _id: ObjectId(req.params.id)
      });

      if (!fetchFixture)
        return resp.status(404).json({ msg: "Fixture record not found" });

      fetchFixture = {
        ...fetchFixture._doc,
        ...req.body
      };

      const updatedFixture = await Fixture.findByIdAndUpdate(
        req.params.id,
        fetchFixture,
        { new: true }
      );

      resp.status(200).json(updatedFixture);
    } else {
      resp
        .status(200)
        .json({ message: "Fixture id is not valid or not found" });
    }
  } catch (error) {
    next(error);
  }
};

/* Delete fixture based on id*/
exports.deleteFixture = async (req, resp, next) => {
  try {
    const fixture = await Fixture.findByIdAndDelete({
      _id: ObjectId(req.params.id)
    });
    resp.status(200).json({ message: `Fixture has been record deleted!` });
  } catch (error) {
    next(error);
  }
};

/* Delete all Players*/
exports.deleteAllFixture = async (req, resp, next) => {
  try {
    const fixture = await Fixture.deleteMany({});
    console.log(fixture, "::: deleted records");
    resp
      .status(200)
      .json({ message: `All fixtures records has been deleted!` });
  } catch (error) {
    next(error);
  }
};
