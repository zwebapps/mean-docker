const { authJwt } = require("../middlewares/");
const compitition = require("../controllers/compitition.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.post("/compitition/create", authJwt.isAuthenticated, compitition.createCompitition);

app.get("/compitition/all", authJwt.isAuthenticated, compitition.getAllCompititions);

app.get("/compitition/:id", authJwt.isAuthenticated, compitition.getCompititionById);

app.get("/compitition/shortcode/:shortcode", authJwt.isAuthenticated, compitition.getCompititionByShortCode);

app.get("/compitition/compititionbyname/:name", authJwt.isAuthenticated, compitition.getCompititionByName);

app.post("/compitition/update/:id", authJwt.isAuthenticated, compitition.updateCompitition);

app.post("/compitition/delete/:id", authJwt.isAuthenticated, compitition.deleteCompitition);

app.post("/compitition/delete/all", authJwt.isAuthenticated, compitition.deleteAllCompititions);

app.get("/compitition/forshortcode/:shortcode", authJwt.isAuthenticated, compitition.forShortCode);

};