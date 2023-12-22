const db = require("../models");
const ObjectId = require("mongodb").ObjectId;
const Academy = db.academy;
const Team = db.team;
const Competition = db.competition;
const Fixture = db.fixture;
const League = db.league;
const Player = db.player;
const User = db.user;

exports.getDashboardContents = async (req, resp, next) => {
  try {
    const { shortcode, role, competition, userId } = req;
    console.log(shortcode, role, competition, userId);
    let academies = [];
    let competitions = [];
    let fixtures = [];
    let leagues = [];
    let players = [];
    let teams = [];
    // coach
    if (role === "coach") {
      academies = await Academy.findOne({
        coach: ObjectId(userId),
        shortcode: shortcode
      })
        .populate("coach")
        .exec();
      console.log(academies);
      competitions = await Competition.find({
        shortcode: shortcode
      })
        .populate(["organiser", "user_id"])
        .exec();

      leagues = await League.find({
        competition: Array.isArray(competition)
          ? competition[0]._id
          : competition._id,
        shortcode: shortcode
      });
      players = await Player.find({
        user: userId,
        competition: Array.isArray(competition)
          ? competition[0]._id
          : competition._id,
        shortcode: shortcode
      })
        .populate("league")
        .populate("academy")
        .populate("team")
        .populate("user")
        .populate("competition")
        .sort({ createdAt: -1 })
        .exec();
      teams = await Team.find({
        academy_id: academies._id,
        shortcode: shortcode
      })
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      if (teams) {
        teams = JSON.parse(JSON.stringify(teams));
        teams = teams.map((team) => {
          return { ...team, count: team.leagues.length };
        });
      }
      // admin
    } else if (role === "admin") {
      academies = await Academy.find({
        user_id: ObjectId(userId),
        shortcode: shortcode
      })
        .populate(["coach"])
        .exec();
      competitions = await Competition.find({})
        .populate(["organiser", "user_id"])
        .exec();
      fixtures = await Fixture.find({}).populate([
        "league",
        "homeTeam",
        "awayTeam",
        "user_id",
        "competition"
      ]);
      leagues = await League.find({
        user_id: ObjectId(userId),
        shortcode: shortcode
      });
      players = await Player.find({
        shortcode: shortcode
      })
        .populate("league")
        .populate("academy")
        .populate("team")
        .populate("user")
        .populate("competition")
        .sort({ createdAt: -1 })
        .exec();
      teams = await Team.find({
        user_id: ObjectId(userId),
        shortcode: shortcode
      })
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      if (teams) {
        teams = JSON.parse(JSON.stringify(teams));
        teams = teams.map((team) => {
          return { ...team, count: team.leagues.length };
        });
      }
      // suepr admin
    } else {
      academies = await Academy.find({}).populate(["coach"]).exec();
      competitions = await Competition.find({})
        .populate(["organiser", "user_id"])
        .exec();
      fixtures = await Fixture.find({}).populate([
        "league",
        "homeTeam",
        "awayTeam",
        "user_id",
        "competition"
      ]);
      leagues = await League.find({});
      players = await Player.find({})
        .populate("league")
        .populate("academy")
        .populate("team")
        .populate("user")
        .populate("competition")
        .sort({ createdAt: -1 })
        .exec();
      teams = await Team.find({})
        .populate(["academy_id", "leagues", "user_id"])
        .exec();
      if (teams) {
        teams = JSON.parse(JSON.stringify(teams));
        teams = teams.map((team) => {
          return { ...team, count: team.leagues.length };
        });
      }
    }
    return resp.status(200).json({
      success: true,
      data: {
        teams,
        players,
        academies: Array.isArray(academies) ? academies : [academies],
        competitions,
        fixtures,
        leagues
      },
      message: "Dashboard data fetched successfully"
    });
  } catch (error) {
    console.log(error);
    return resp.status(404).json({
      success: false,
      message: "Dashboard data fetching failed"
    });
  }
};
