const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const User = db.user;
const Role = db.role;
const Contact = db.contact;
const bcrypt = require("bcryptjs");
const emailUtils = require("../utilities/mailUtils");

exports.allAccess = (req, res) => {
  res.status(200).send({ content: "Public Content." });
};

exports.userBoard = (req, res) => {
  res.status(200).json({ content: "User Content." });
};

exports.adminBoard = (req, res) => {
  res.status(200).json({ content: "Admin Content." });
};
exports.moderatorBoard = (req, res) => {
  res.status(200).json({ content: "Moderator Content." });
};

exports.getAllUsers = (req, res) => {
  // get users
  User.find({})
    .populate(["roles", "competition"])
    .sort({ createdAt: -1 })
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      return res
        .status(200)
        .json(users.length > 0 ? users : { message: "No user found" });
    });
};

exports.forShortcode = (req, res) => {
  // get users
  User.find({ shortcode: req.params.shortcode })
    .populate(["competition", "roles"])
    .sort({ createdAt: -1 })
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      return res
        .status(200)
        .json(users.length > 0 ? users : { message: "No user found" });
    });
};

exports.forCompetition = (req, res) => {
  // get users
  User.find({ competition: ObjectId(req.params.competition) })
    .populate("roles")
    .sort({ createdAt: -1 })
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      return res
        .status(200)
        .json(users.length > 0 ? users : { message: "No user found" });
    });
};

exports.createUser = async (req, res) => {
  // get users
  if (req.body && req.body["username"] && req.body["password"].length > 0) {
    // validate emirates id
    const isValidated = req.body["username"] && req.body["username"].length > 0;
    const isUsernameExists = await User.findOne({
      username: req.body["username"]
    });
    if (isValidated && !isUsernameExists) {
      // check if the same eid is already in the database
      let user = await User.findOne({ email: req.body["email"] });
      // get role by name
      let role = await Role.findOne({ name: req.body["role"] });

      if (!user) {
        const userData = new User({
          firstname: req.body["firstname"],
          lastname: req.body["lastname"],
          username: req.body["username"],
          contact: req.body["contact"],
          password: bcrypt.hashSync(req.body["password"], 8),
          email: req.body["email"],
          shortcode: req.body["shortCode"],
          competitionCountry: req.body["competitionCountry"]
            ? req.body["competitionCountry"]
            : "AE",
          competition: req.body.competition
            ? req.body.competition.map((comp) => ObjectId(comp))
            : [],
          roles: [ObjectId(role._id)],
          createdBy: ObjectId(req.body.user["createdBy"])
        });

        const savedUser = await userData.save();
        res.status(200).json(savedUser);
      } else {
        res.status(200).json({ message: "User already exists" });
      }
    } else {
      res
        .status(200)
        .json({ message: "Name is not valid / username already exists" });
    }
  } else {
    res.status(200).json({ message: "Username  is not valid" });
  }
};

exports.deleteUser = async (req, resp, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: ObjectId(req.params.id) });
    if (!user) {
      return resp
        .status(200)
        .json({ message: `No record found`, type: "error" });
    }
    return resp.status(200).json({ message: `User deleted sucessfully!` });
  } catch (error) {
    next(error);
  }
};

exports.UserByIdOrEID = async (req, resp, next) => {
  try {
    const { id } = req.params;
    if (id && id.includes(",")) {
      let userIds = id.split(",");
      const users = await User.find({ _id: { $in: userIds } })
        .populate("roles")
        .exec();
      resp.status(200).json(users ? users : { message: "Users not found" });
    } else {
      // check if emries id or normal id
      const userData = await User.findOne({ _id: ObjectId(id) })
        .populate("roles")
        .exec();
      resp
        .status(200)
        .json(userData ? userData : { message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.AdminEmailById = async (req, resp, next) => {
  try {
    const { id } = req.params;
    if (id && id.includes(",")) {
      let userIds = id.split(",");
      const users = await User.find({ _id: { $in: userIds } })
        .populate("roles")
        .exec();
      resp.status(200).json(users ? users : { message: "Users not found" });
    } else {
      // check if emries id or normal id
      const userData = await User.findOne({ _id: ObjectId(id) })
        .populate("roles")
        .exec();
      resp
        .status(200)
        .json(userData ? userData.email : { message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, resp, next) => {
  try {
    const { id } = req.params;
    let updatedUser = {};
    let fetchUser = await User.findOne({ _id: ObjectId(id) });

    if (!fetchUser)
      return resp.status(404).json({ msg: "User record not found" });
    if (req.body.password && req.body.password.length < 15) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    if (req.body["firstname"]) {
      updatedUser = {
        ...updatedUser,
        firstname: req.body["firstname"]
      };
    }
    if (req.body["lastname"]) {
      updatedUser = {
        ...updatedUser,
        lastname: req.body["lastname"]
      };
    }

    if (req.body["username"]) {
      updatedUser = {
        ...updatedUser,
        username: req.body["username"]
      };
    }

    if (req.body["contact"]) {
      updatedUser = {
        ...updatedUser,
        contact: req.body["contact"]
      };
    }

    if (req.body["password"]) {
      updatedUser = {
        ...updatedUser,
        password: bcrypt.hashSync(req.body["password"], 8)
      };
    }

    if (req.body["email"]) {
      updatedUser = {
        ...updatedUser,
        email: req.body["email"]
      };
    }

    fetchUser = {
      ...fetchUser._doc,
      ...req.body,
      ...updatedUser
    };

    User.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        $set: fetchUser
      },
      { new: true }
    ).then((updatedUser) => {
      return resp.status(200).json(updatedUser);
    });
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res) => {
  if (req.body && req.body["heading"] && req.body["content"].length > 0) {
    const heading = `${new Date().toISOString()}_${req.body["heading"]}`;
    const contactData = new Contact({
      senderEmail: req.body["senderEmail"],
      heading: heading,
      content: req.body["content"],
      user: ObjectId(req.body.user["id"]),
      shortcode: req.body["shortcode"],
      status: "Pending",
      createdAt: new Date()
    });

    const savedContact = await contactData.save();
    // sending email
    emailUtils.sendEmail(req.body).then((emailResponse) => {
      return res.status(200).json({
        data: savedContact,
        message: "Contact created successfully!",
        emailResponse
      });
    });
  } else {
    res.status(200).json({ message: "Data is not provided correctly" });
  }
};
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    // get users
    if (id) {
      let fetchContact = await Contact.findOne({ _id: ObjectId(id) });

      if (!fetchContact)
        return resp.status(404).json({ msg: "Content record not found" });
      fetchContact = {
        ...fetchContact._doc,
        reply: req.body.reply,
        status: req.body.status
      };

      Contact.findByIdAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: fetchContact
        },
        { new: true }
      ).then((updateContent) => {
        return res.status(200).json({
          content: updateContent,
          message: "Notifications updated successfully!"
        });
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.contentDelete = async (req, resp, next) => {
  try {
    const content = await Contact.findByIdAndDelete({
      _id: ObjectId(req.params.id)
    });
    if (!content) {
      return resp
        .status(200)
        .json({ message: `No record found`, type: "error" });
    }
    return resp.status(200).json({ message: `Content record deleted!` });
  } catch (error) {
    next(error);
  }
};
exports.getAllContacts = (req, res) => {
  // get users
  Contact.find({})
    .populate("user")
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      return res
        .status(200)
        .json(users.length > 0 ? users : { message: "No content found" });
    });
};

exports.contentForShortCode = async (req, res) => {
  const { shortcode } = req.params;
  // get users
  const content = await Contact.find({ shortcode: shortcode })
    .populate("user")
    .exec();
  if (content) {
    return res.status(200).send({
      conent: content,
      status: "Success",
      message: "Conents fetched successrully!"
    });
  } else {
    return res.status(200).json({ message: "No content found" });
  }
};

exports.forContentsCompetition = async (req, res) => {
  const { competition } = req.params;
  // get users
  const content = await Contact.find({ competition: ObjectId(competition) })
    .populate("user")
    .exec();
  if (content) {
    return res.status(200).send({
      conent: content,
      status: "Success",
      message: "Conents fetched successrully!"
    });
  } else {
    return res.status(200).json({ message: "No content found" });
  }
};

exports.allContactsByIdCoach = async (req, res) => {
  const { id } = req.params;
  // get users
  const content = await Contact.find({ user: ObjectId(id) })
    .populate("user")
    .exec();
  if (content) {
    return res.status(200).send({
      conent: content,
      status: "Success",
      message: "Conents fetched successrully!"
    });
  } else {
    return res.status(200).json({ message: "No content found" });
  }
};
