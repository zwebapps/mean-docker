const { ObjectId } = require("mongodb");
const db = require("../models");
const Roles = db.role;

exports.allRoles = async (req, res) => {
  const roles = await Roles.find({});
  res.status(200).json(roles);
};
