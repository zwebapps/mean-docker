const dotenv = require("dotenv");
if (!process.env.DB_USERNAME) {
  dotenv.config();
}
const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const bcrypt = require("bcryptjs");

const cors = require("cors");
const cookieSession = require("cookie-session");
const environment = require("./app/config/db.config");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
global.__basedir = __dirname;
const { secret, client } = require("./app/config/auth.config");

app.use(morgan("tiny"));

/* for Angular Client (withCredentials) */
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "football-session",
    keys: [secret],
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;
const User = db.user;
const Settings = db.settings;
const Increment = db.increment;
const uri =
  "mongodb://admin-user:admin-password@0.0.0.0:27017/mean-football?authSource=admin";

// const uri =
//   "mongodb://admin-user:admin-password@yflpms.com:27017/mean-football?authSource=admin";

db.mongoose
  .connect(environment.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to football management application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/academy.routes")(app);
require("./app/routes/fixture.routes")(app);
require("./app/routes/league.routes")(app);
require("./app/routes/player.routes")(app);
require("./app/routes/team.routes")(app);
require("./app/routes/roles.routes")(app);
require("./app/routes/competition.routes")(app);
require("./app/routes/dashboard.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;

app.use(
  "/static",
  express.static(path.join(__basedir, "public/resources/assets"))
);
app.use("/csv", express.static(path.join(__basedir, "public/resources/csv")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.deleteMany({}).then((rest) => {
    console.log(rest.deletedCount, "deleting all");
    Role.estimatedDocumentCount((err, count) => {
      new Role({
        _id: ObjectId("6567914b7d2b0a879a8840cc"),
        name: "superadmin"
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'superadmin' to roles collection");
      });
      new Role({
        _id: ObjectId("5895b74ca84c675de0d3338d"),
        name: "admin"
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });

      new Role({
        _id: ObjectId("5895b74da84c675de0d3338e"),
        name: "coach"
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'coach' to roles collection");
      });

      new Role({
        _id: ObjectId("5895b74ea84c675de0d3338f"),
        name: "referee"
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'referee' to roles collection");
      });
    });
  });

  Role.find({}).then((roles) => {
    console.log(roles, "roles");
  });
  // creating yfl super admin
  User.findOne({ username: "yfldubai" })
    .exec()
    .then((users) => {
      if (!users) {
        new User({
          _id: ObjectId("65847ca364f90bb9aacd7a49"),
          firstname: "super",
          lastname: "admin",
          username: "yfldubai",
          shortcode: "yfl",
          competition: [],
          contact: "+971553762217",
          password: bcrypt.hashSync("yfl2023", 8),
          email: "admin@yfl.com",
          roles: [ObjectId("6567914b7d2b0a879a8840cc")],
          competition: [
            ObjectId("65725988ee29b16ea6885a6b"),
            ObjectId("6578bc1ef8716dd1219302e1")
          ],
          createdBy: ObjectId("6567914b7d2b0a879a8840cc")
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin user' to users collection");
        });
      }
    });
  // creating yfl admin
  User.findOne({ username: "football@yfl" })
    .exec()
    .then((users) => {
      if (!users) {
        new User({
          _id: ObjectId("65847beb24b2f0563e89b307"),
          firstname: "yfl",
          lastname: "admin",
          username: "football@yfl",
          contact: "+971553762217",
          shortcode: "yfl",
          competition: [],
          password: bcrypt.hashSync("yfl2023", 8),
          email: "admin@yfl.com",
          roles: [ObjectId("5895b74ca84c675de0d3338d")],
          competition: [
            ObjectId("65725988ee29b16ea6885a6b"),
            ObjectId("6578bc1ef8716dd1219302e1")
          ],
          createdBy: ObjectId("65847ca364f90bb9aacd7a49")
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin user' to users collection");
        });
      }
    });

  //adding settings for email
  Settings.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Settings({
        settingsName: "notificationSettings",
        settingsValue: JSON.stringify({
          host: "smtp.gmail.com",
          port: 465,
          username: "zdev1989@gmail.com",
          password: "etek xruj mygy qnsl"
        })
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added Notification Settings");
      });
    }
  });

  Increment.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Increment({ name: "item_id", sequence_value: 0 }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Counter for sequence' to increment collection");
      });
    }
  });
}
