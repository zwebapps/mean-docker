const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const Competition = db.competition;

/* Add new fixture*/
exports.createCompetition = async (req, resp, next) => {
  try {
    // multiple creation
    if (req.body && Array.isArray(req.body)) {
      let insertedCompetitions = [];
      for (let i = 0; i < req.body.length; i++) {
        if (req.body[i]["competitionName"]) {
          const competitionData = new Competition({
            competitionName: req.body[i]["competitionName"],
            organiser: req.body[i]["organiser"],
            shortCode: req.body[i]["shortCode"],
            competitionLogo: req.body[i]["competitionLogo"],
            competitionSettings: req.body[i]["competitionSettings"],
            competitionSeason: req.body[i]["competitionSeason"],
            competitionCountry: req.body[i]["competitionCountry"],
            competitionYear: req.body[i]["competitionYear"],
            competitionStart: req.body[i]["competitionStart"],
            competitionEnd: req.body[i]["competitionEnd"],
            user_id: ObjectId(req.body[i].user["createdBy"]),
            createdAt: new Date()
          });
          const savedCompetition = await competitionData.save();
          insertedCompetitions.push(savedCompetition);
        }
      }
      return resp.status(200).json(insertedCompetitions);
    } else if (req.body["competitionName"]) {
      const competitionData = new Competition({
        competitionName: req.body["competitionName"],
        organiser: req.body["organiser"],
        shortCode: req.body["shortCode"],
        competitionLogo: req.body["competitionLogo"],
        competitionSettings: req.body["competitionSettings"],
        competitionSeason: req.body["competitionSeason"],
        competitionCountry: req.body["competitionCountry"],
        competitionYear: req.body["competitionYear"],
        competitionStart: req.body["competitionStart"],
        competitionEnd: req.body["competitionEnd"],
        user_id: ObjectId(req.body.user["createdBy"]),
        createdAt: new Date()
      });
      await competitionData.save();
      return resp
        .status(200)
        .json({ message: "Competition has been created successfully!" });
    }
  } catch (error) {
    return resp
      .status(400)
      .json({ message: "Competition creation failed!" + error });
  }
};

/* GET all Competitions listing. */
exports.getAllCompetitions = async (req, resp, next) => {
  try {
    const competition = await Competition.find({})
      .populate(["organiser", "user_id"])
      .exec();
    resp
      .status(200)
      .json(
        competition.length > 0
          ? competition
          : { message: "No competition found" }
      );
  } catch (error) {
    next(error);
  }
};

exports.forShortCode = async (req, resp, next) => {
  try {
    const competition = await Competition.find({ _id: req.params.id }).exec();
    resp.status(200).json(competition);
  } catch (error) {
    next(error);
  }
};
/* Get competition based on id*/
exports.getCompetitionById = async (req, resp, next) => {
  try {
    const competition = await Competition.find({
      _id: ObjectId(req.params.id)
    });
    resp.status(200).json(competition);
  } catch (error) {
    next(error);
  }
};

exports.getCompetitionByName = async (req, resp, next) => {
  try {
    const competition = await Competition.find({
      competitionName: req.params.name
    });
    return resp
      .status(200)
      .json(competition ? competition : { message: "No competition found" });
  } catch (error) {
    next(error);
  }
};
exports.getCompetitionByShortCode = async (req, resp, next) => {
  try {
    const competition = await Competition.find({
      shortCode: req.params.shortcode
    });
    return resp
      .status(200)
      .json(competition ? competition : { message: "No competition found" });
  } catch (error) {
    next(error);
  }
};
/* Edit existing fixture based on id*/
exports.updateCompetition = async (req, resp, next) => {
  try {
    if (req.params && req.params.id) {
      let fetchCompetition = await Competition.find({
        _id: ObjectId(req.params.id)
      });

      if (!fetchCompetition)
        return resp.status(404).json({ msg: "Competition record not found" });

      fetchCompetition = {
        ...fetchCompetition._doc,
        ...req.body
      };

      const updatedCompetition = await Competition.findByIdAndUpdate(
        req.params.id,
        fetchCompetition,
        { new: true }
      );

      resp.status(200).json(updatedCompetition);
    } else {
      resp
        .status(200)
        .json({ message: "Competition id is not valid or not found" });
    }
  } catch (error) {
    next(error);
  }
};

/* Delete competition based on id*/
exports.deleteCompetition = async (req, resp, next) => {
  try {
    const competition = await Competition.findByIdAndDelete({
      _id: ObjectId(req.params.id)
    });
    resp.status(200).json({
      message: `Competition has been record deleted! ${competition.competitionName}`
    });
  } catch (error) {
    next(error);
  }
};

/* Delete all Competition*/
exports.deleteAllCompetitions = async (req, resp, next) => {
  try {
    const competition = await Competition.deleteMany({});
    console.log(competition, "::: deleted records");
    resp
      .status(200)
      .json({ message: `All competitions records has been deleted!` });
  } catch (error) {
    next(error);
  }
};
