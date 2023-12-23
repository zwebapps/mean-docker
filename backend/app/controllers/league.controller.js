const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const League = db.league;

/* Add new league*/
exports.createLeague = async (req, resp, next) => {
  try {
    // multiple creation
    if (req.body && Array.isArray(req.body)) {
      let insertedLeagues = [];
      for (let i = 0; i < req.body.length; i++) {
        const isValidated =
          req.body[i]["League Name"] && req.body[i]["League Name"].length > 0
            ? true
            : false;
        if (isValidated) {
          let league = await League.findOne({
            leagueName: req.body[i]["League Name"]
          });
          if (!league) {
            const leagueData = new League({
              leagueName: req.body[i]["League Name"],
              leagueAgeLimit: req.body[i]["Age Limit"],
              shortcode: req.body[i]["Short Code"],
              year: req.body[i]["Year"],
              user_id: ObjectId(req.body[i].user["createdBy"]),
              competition: ObjectId(req.body[i].competition),
              createdAt: new Date()
            });
            insertedLeagues.push(req.body[i]);
            await leagueData.save();
          }
        }
      }
      resp.status(200).json(insertedLeagues);
    } else if (req.body && req.body["League Name"]) {
      // validate emirates id
      const isValidated =
        req.body["League Name"] && req.body["League Name"].length > 0;
      if (isValidated) {
        // check if the same eid is already in the database
        let league = await League.findOne({
          shortcode: req.body["Short Code"],
          user_id: ObjectId(req.body.user["createdBy"]),
          leagueName: req.body["League Name"]
        });
        if (!league) {
          const leagueData = new League({
            leagueName: req.body["League Name"],
            leagueAgeLimit: req.body["Age Limit"],
            shortcode: req.body["Short Code"],
            year: req.body["Year"],
            user_id: ObjectId(req.body.user["createdBy"]),
            competition: ObjectId(req.body.competition),
            createdAt: new Date()
          });

          const savedLeague = await leagueData.save();
          resp.status(200).json(savedLeague);
        } else {
          resp
            .status(200)
            .json({ type: "error", message: "League already exists" });
        }
      } else {
        resp.status(200).json({ type: "error", message: "Name is not valid" });
      }
    } else {
      resp
        .status(200)
        .json({ type: "error", message: "Malformed data provided" });
    }
  } catch (error) {
    next(error);
  }
};

/* GET all Leagues. */
exports.getLeagues = async (req, resp, next) => {
  try {
    const leagues = await League.find({})
      .populate(["user_id", "competition"])
      .exec();
    return resp.status(200).json(leagues);
  } catch (error) {
    next(error);
  }
};

/* Get League based on id*/
exports.getLeagueById = async (req, resp, next) => {
  try {
    const league = await League.find({ _id: ObjectId(req.params.id) })
      .populate(["competition", "user_id"])
      .exec();
    resp.status(200).json(league ? league : { message: "No league found" });
  } catch (error) {
    next(error);
  }
};

exports.forShortCode = async (req, resp, next) => {
  try {
    const league = await League.find({ shortcode: req.params.shortcode })
      .populate(["user_id", "competition"])
      .exec();
    resp.status(200).json(league ? league : { message: "No league found" });
  } catch (error) {
    next(error);
  }
};
exports.forCompetition = async (req, resp, next) => {
  try {
    const league = await League.find({
      competition: ObjectId(req.params.competition)
    })
      .populate(["user_id", "competition"])
      .exec();
    resp.status(200).json(league ? league : { message: "No league found" });
  } catch (error) {
    next(error);
  }
};

/* Edit existing League based on id*/
exports.updateLeague = async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchLeague = await League.find({ _id: ObjectId(id) });

    if (!fetchLeague)
      return resp.status(404).json({ message: "League record not found" });
    fetchLeague = {
      ...fetchLeague._doc,
      ...req.body
    };

    const updatedLeague = await League.findByIdAndUpdate(
      req.params.id,
      fetchLeague,
      { new: true }
    );

    resp.status(200).json(updatedLeague);
  } catch (error) {
    next(error);
  }
};

/* Delete league based on id*/
exports.deleteLeague = async (req, resp, next) => {
  try {
    const league = await League.findByIdAndDelete({
      _id: ObjectId(req.params.id)
    });
    if (!league) {
      resp
        .status(200)
        .json({ message: `League ${league.leagueName} record deleted!` });
    }
    resp.status(200).json({
      message: `League ${league.leagueName} record deleted!`
    });
  } catch (error) {
    next(error);
  }
};

/* Delete all Leagues*/
exports.deleteAllLeagues = async (req, resp, next) => {
  try {
    const lg = await League.remove({});
    resp.status(200).json({ message: "All leagues deleted!" });
  } catch (error) {
    next(error);
  }
};
