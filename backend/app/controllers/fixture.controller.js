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
            competition: ObjectId(req.body[i]["competition"]),
            shortcode: ObjectId(req.body[i].shortcode),
            mvp: req.body[i]["mvp"] ? ObjectId(req.body[i]["mvp"]) : null,
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
        mvp: req.body["mvp"] ? ObjectId(req.body["mvp"]) : null,
        competition: ObjectId(req.body.competition),
        createdAt: new Date()
      });

      const savedFixture = await fixtureData.save();
      return resp.status(200).json(savedFixture);
    }
  } catch (error) {
    next(error);
  }
};

/* GET all fixture listing. */
exports.getAllFixture = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({ deleted: false }).populate([
      "league",
      "homeTeam",
      "awayTeam",
      "user_id",
      "competition",
      "mvp"
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
      _id: ObjectId(req.params.id),
      deleted: false
    }).populate([
      "league",
      "homeTeam",
      "awayTeam",
      "competition",
      "user_id",
      "mvp"
    ]);
    resp.status(200).json(fixture);
  } catch (error) {
    next(error);
  }
};

exports.forShortCode = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({
      shortcode: req.params.shortcode,
      deleted: false
    })
      .populate([
        "league",
        "homeTeam",
        "awayTeam",
        "competition",
        "user_id",
        "mvp"
      ])
      .sort({ createdAt: -1 })
      .exec();
    resp.status(200).json(fixture);
  } catch (error) {
    next(error);
  }
};
exports.forCompetition = async (req, resp, next) => {
  try {
    const fixture = await Fixture.find({
      competition: ObjectId(req.params.competition),
      deleted: false
    }).populate([
      "league",
      "homeTeam",
      "awayTeam",
      "competition",
      "user_id",
      "mvp"
    ]);
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
        _id: ObjectId(req.params.id),
        deleted: false
      });

      if (!fetchFixture)
        return resp.status(404).json({ msg: "Fixture record not found" });

      fetchFixture = {
        ...fetchFixture._doc,
        ...req.body,
        mvp: req.body["mvp"]
          ? ObjectId(req.body["mvp"])
          : fetchFixture._doc["mvp"]
      };

      const updatedFixture = await Fixture.findByIdAndUpdate(
        req.params.id,
        fetchFixture,
        { new: true }
      )
        .populate(["league", "homeTeam", "awayTeam", "user_id", "mvp"])
        .exec();

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
    const fixture = await Fixture.findByIdAndUpdate(ObjectId(req.params.id), {
      deleted: true
    });
    resp
      .status(200)
      .json({ message: `Fixture has been record deleted!`, fixture });
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
