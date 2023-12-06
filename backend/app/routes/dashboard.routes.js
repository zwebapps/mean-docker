const { authJwt } = require("../middlewares/");
const dashboard = require("../controllers/dashboard.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.get("/dashboard/allgraphs", authJwt.isAuthenticated, dashboard.getDashboardContents);

};