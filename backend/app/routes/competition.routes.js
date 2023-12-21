const { authJwt } = require("../middlewares");
const competition = require("../controllers/competition.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/competition/create",
    authJwt.isAuthenticated,
    competition.createCompetition
  );

  app.get(
    "/competition/all",
    authJwt.isAuthenticated,
    competition.getAllCompetitions
  );

  app.get(
    "/competetion/:id",
    authJwt.isAuthenticated,
    competition.getCompetitionById
  );

  app.get(
    "/competition/shortcode/:shortcode",
    authJwt.isAuthenticated,
    competition.getCompetitionByShortCode
  );

  app.get(
    "/competition/competitionbyname/:name",
    authJwt.isAuthenticated,
    competition.getCompetitionByName
  );

  app.post(
    "/competition/update/:id",
    authJwt.isAuthenticated,
    competition.updateCompetition
  );

  app.post(
    "/competition/delete/:id",
    authJwt.isAuthenticated,
    competition.deleteCompetition
  );

  app.post(
    "/competition/delete/all",
    authJwt.isAuthenticated,
    competition.deleteAllCompetitions
  );

  app.get(
    "/competition/forshortcode/:shortcode",
    authJwt.isAuthenticated,
    competition.forShortCode
  );
};
