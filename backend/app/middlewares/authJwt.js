const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split(" ")[1];
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!"
          });
        }
        req.shortcode = decoded.shortcode;
        req.role = decoded.role;
        req.competition = decoded.role === "coach" ? decoded.competition : null;
        req.userId = decoded.id;
        next();
      });
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (error) {
    res.status(401).json({ message: "No token provided" });
  }
};

isAuthenticated = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.shortcode = decoded.shortcode;
    req.role = decoded.role;
    req.competition = decoded.role === "coach" ? decoded.competition : null;
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const { userId, role } = req;
  if (role === "admin" || role === "superadmin") {
    next();
    return;
  } else {
    const reqUser = await User.findById(new ObjectId(userId));
    User.findById(new ObjectId(req.userId)).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      Role.find(
        {
          _id: { $in: user && user.roles ? user.roles : reqUser.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin" || roles[i].name === "superadmin") {
              next();
              return;
            }
          }

          res.status(403).send({ message: "Require Admin Role!" });
          return;
        }
      );
    });
  }
};

isUserAllowed = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.shortcode = decoded.shortcode;
      req.role = decoded.role;
      req.competition = decoded.role === "coach" ? decoded.competition : null;
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "No token provided" });
  }
};
isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAuthenticated,
  isAdmin,
  isModerator
};
module.exports = authJwt;
