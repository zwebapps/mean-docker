const { ObjectId } = require("mongodb");
const db = require("../models");
const Team = db.team;
const Player = db.player;

const updateAssociatedPlayers = async ({
  teamId,
  academyId,
  competitionId,
  leagueId,
  shortCode,
  updateLeagueId
}) => {
  try {
    const updatedPlayers = await Player.updateMany(
      {
        academy: new ObjectId(academyId),
        competition: new ObjectId(competitionId),
        league: new ObjectId(leagueId),
        shortcode: shortCode,
        team: new ObjectId(teamId)
      },
      {
        $set: {
          league: new ObjectId(updateLeagueId)
        }
      }
    );
    return updatedPlayers;
  } catch (error) {
    console.log(error);
    return { updated: false };
  }
};

/* Add new team*/
exports.createTeam = async (req, resp, next) => {
  try {
    // multiple creation
    if (req.body && Array.isArray(req.body)) {
      let insertedTeams = [];
      for (let i = 0; i < req.body.length; i++) {
        const isValidated =
          req.body[i]["Team Name"] && req.body[i]["Team Name"].length > 0;
        if (isValidated) {
          let team = await Team.findOne({ teamName: req.body["Team Name"] });
          if (!team) {
            const teamData = new Team({
              teamName: req.body[i]["Team Name"],
              academy_id: req.body[i]["Academy Id"],
              leagues: [...req.body[i].leagues],
              user_id: new ObjectId(req.body[i].user["createdBy"]),
              shortcode: req.body[i]["shortCode"],
              competition: new ObjectId(req.body[i]["competition"]),
              createdAt: new Date()
            });
            insertedTeams.push(req.body[i]);
            await teamData.save();
          }
        }
      }
      resp.status(200).json(insertedTeams);
    } else if (req.body && req.body["Team Name"]) {
      // validate Team Name
      const isValidated =
        req.body["Team Name"] && req.body["Team Name"].length > 0;
      if (isValidated) {
        // check if the same eid is already in the database
        const team = await Team.findOne({ teamName: req.body["Team Name"] });

        if (!team) {
          const teamData = new Team({
            teamName: req.body["Team Name"],
            academy_id: req.body["Academy Id"],
            leagues: [...req.body.leagues],
            user_id: new ObjectId(req.body.user["createdBy"]),
            shortcode: req.body["shortCode"],
            competition: new ObjectId(req.body["competition"]),
            createdAt: new Date()
          });

          const savedPlayer = await teamData.save();
          resp.status(200).json(savedPlayer);
        } else {
          resp.status(200).json({ message: "Team already exists" });
        }
      } else {
        resp.status(200).json({ message: "Team Name is not valid" });
      }
    } else {
      resp.status(200).json({ message: "Malformed data provided" });
    }
  } catch (error) {
    next(error);
  }
};

/* GET all team. */
exports.getAllTeams = async (req, resp, next) => {
  try {
    const teams = await Team.find()
      .populate(["academy_id", "leagues", "user_id"])
      .exec();
    resp
      .status(200)
      .json(teams.length > 0 ? teams : { message: "No team found" });
  } catch (error) {
    next(error);
  }
};

/* Get team based on id*/
exports.getTeamById = async (req, resp, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const team = await Team.findOne({ _id: new ObjectId(id) })
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      resp.status(200).json(team ? team : { message: "No team found" });
    } else {
      resp.status(200).json({ message: "Malformed Id provided" });
    }
  } catch (error) {
    next(error);
  }
};

exports.forShortCode = async (req, resp, next) => {
  try {
    const { shortcode } = req.params;
    if (shortcode) {
      const team = await Team.find({ shortcode: req.params.shortcode })
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      resp.status(200).json(team ? team : { message: "No team found" });
    } else {
      resp.status(200).json({ message: "Malformed Id provided" });
    }
  } catch (error) {
    next(error);
  }
};
exports.forCompetition = async (req, resp, next) => {
  try {
    const { competition } = req.params;
    if (competition) {
      const team = await Team.find({
        competition: new ObjectId(req.params.competition)
      })
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      resp.status(200).json(team ? team : { message: "No team found" });
    } else {
      resp.status(200).json({ message: "Malformed Id provided" });
    }
  } catch (error) {
    next(error);
  }
};
exports.getTeamByAcademyId = async (req, resp, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const team = await Team.find({ academy_id: new ObjectId(req.params.id) })
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      resp
        .status(200)
        .json(team.length > 0 ? team : { message: "No team found" });
    } else {
      resp.status(200).json({ message: "Malformed Id provided" });
    }
  } catch (error) {
    next(error);
  }
};

/* Edit existing team based on id*/
exports.updateTeam = async (req, resp, next) => {
  try {
    const { id } = req.params;
    const { academy_id, competition, leagues, shortcode } = req.body;
    if (id) {
      let fetchTeam = await Team.findOne({ _id: new ObjectId(id) })
        .populate(["academy_id", "leagues", "user_id"])
        .lean()
        .exec();
      if (!fetchTeam)
        return resp.status(404).json({ message: "Team record not found" });
      const updatePlz = {
        teamId: fetchTeam._id,
        academyId: academy_id._id,
        competitionId: competition,
        leagueId: fetchTeam.leagues[0]._id,
        shortCode: shortcode,
        updateLeagueId: leagues[0]
      };

      const fetchedTeam = {
        ...fetchTeam._doc,
        ...req.body
      };

      const updatedTeam = await Team.findByIdAndUpdate(
        req.params.id,
        fetchedTeam,
        { new: true }
      );

      const updatedPlayers = await updateAssociatedPlayers(updatePlz);
      resp
        .status(200)
        .json({
          team: updatedTeam,
          updatedPlayers: updatedPlayers.modifiedCount
        })
        .status(200);
    } else {
      resp.status(200).json({ message: "Malformed Id provided" });
    }
  } catch (error) {
    next(error);
  }
};

/* Delete team based on id*/
exports.deleteTeam = async (req, resp, next) => {
  try {
    if (req.params && req.params.id) {
      const team = await Team.findByIdAndDelete({
        _id: new ObjectId(req.params.id)
      });
      if (!team) {
        resp.status(200).send(`Team record not found!`);
      }
      resp
        .status(200)
        .send({ message: `Team ${team.teamName} record deleted!` });
    } else {
      resp.status(200).json({ message: "Malformed Id provided" });
    }
  } catch (error) {
    next(error);
  }
};

/* Delete all Players*/
exports.deleteAllTeams = async (req, resp, next) => {
  try {
    const team = await Team.remove({});
    resp.status(200).json({ message: `All teams has been deleted!` });
  } catch (error) {
    next(error);
  }
};
