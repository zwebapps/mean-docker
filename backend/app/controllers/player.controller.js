const uploadFile = require("../middlewares/upload");
const uploadFiles = require("../middlewares/uploads");
const { ObjectId } = require("mongodb");
const db = require("../models");
const Player = db.player;
const Increment = db.increment;
const fs = require("fs");
// global.__basedir = __dirname;

const getNextSequence = async (nm) => {
  let counter = await Increment.findOne({ name: nm });
  if (!counter) {
    const increment = new Increment({
      name: nm,
      sequence_value: 0
    });
    await increment.save();
  }
  let sequenceDoc = await Increment.findOneAndUpdate(
    {
      name: nm
    },
    {
      $inc: {
        sequence_value: 1
      }
    }
  ).exec();
  return sequenceDoc.sequence_value;
};

// upload file
exports.upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // // rename the file
    const file_name = Date.now() + "_" + req.file.originalname;
    const folderPath = __basedir + "/public/resources/assets/";
    // Rename the file
    fs.rename(
      folderPath + req.file.originalname,
      folderPath + "/" + file_name,
      () => {
        return res.status(200).send({
          message: "Uploaded the file successfully: " + file_name,
          filename: file_name
        });
      }
    );
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!"
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`
    });
  }
};

exports.multiUpload = async (req, res) => {
  try {
    await uploadFiles(req, res);

    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // // rename the file
    return res.status(200).send({
      message: "Uploaded the files successfully",
      count: req.files.length
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!"
      });
    }

    res.status(500).send({
      message: `Could not upload the file ${err}`
    });
  }
};

exports.getListFiles = (req, res) => {
  const directoryPath = __basedir + "/public/resources/assets/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!"
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: __basedir + "/" + file
      });
    });

    res.status(200).send(fileInfos);
  });
};

exports.download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/public/resources/assets/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err
      });
    }
  });
};
/* Add new employee*/
exports.createPlayer = async (req, resp, next) => {
  // Emirates ID formate:  '784-1986-123456-2'
  try {
    // multiple creation
    if (req.body && Array.isArray(req.body)) {
      let insertedPlayers = [];
      for (let i = 0; i < req.body.length; i++) {
        const isValidated = req.body["isPlayerPassport"]
          ? true
          : req.body[i]["eidNo"] &&
            req.body[i]["eidNo"].split("-").length === 4;
        if (isValidated) {
          let player = await Player.findOne({
            emiratesIdNo: req.body[i]["eidNo"]
          });
          if (req.body[i]["playingUp"]) {
            req.body[i]["playingUp"] = req.body[i]["playingUp"].map(
              (league) => new ObjectId(league)
            );
          }
          if (!player) {
            const playerNo = await getNextSequence("item_id");
            const playerData = new Player({
              gender: req.body[i]["gender"] ? req.body[i]["gender"] : "Male",
              firstName: req.body[i]["firstName"],
              lastName: req.body[i]["surName"],
              dob: new Date(req.body[i]["dob"]),
              squadNo: req.body[i]["squadNo"],
              league: new ObjectId(req.body[i]["league"]),
              academy: new ObjectId(req.body[i]["academy"]),
              team: new ObjectId(req.body[i]["team"]),
              playerNo: playerNo,
              playerImage: req.body[i]["playerImage"],
              emiratesIdNo: req.body[i]["eidNo"],
              eidFront: req.body[i]["eidFront"],
              eidBack: req.body[i]["eidBack"],
              playerStatus: req.body[i]["status"],
              user: new ObjectId(req.body[i].user["createdBy"]),
              playingUp: req.body[i]["playingUp"],
              playingUpTeam: req.body[i]["playingUpTeam"],
              shortcode: req.body[i].shortcode,
              competition: new ObjectId(req.body[i]["competition"]),
              mvp: req.body[i]["mvp"],
              createdAt: new Date()
            });
            insertedPlayers.push(req.body[i]);
            await playerData.save();
          }
        }
      }
      resp.status(200).json(insertedPlayers);
    } else if (req.body && req.body["eidNo"]) {
      // validate emirates id
      const isValidated = req.body["isPlayerPassport"]
        ? true
        : req.body["eidNo"] && req.body["eidNo"].split("-").length === 4;
      if (isValidated) {
        // check if the same eid is already in the database
        let player = await Player.findOne({ emiratesIdNo: req.body["eidNo"] });
        if (!player) {
          let playerNo = null;
          let isNoExist = null;
          do {
            playerNo = await getNextSequence("item_id");
            isNoExist = await Player.findOne({ playerNo: playerNo }).exec();
          } while (isNoExist);
          if (req.body["playingUp"]) {
            req.body["playingUp"] = req.body["playingUp"].map(
              (league) => new ObjectId(league)
            );
          }

          const playerData = new Player({
            gender: req.body["gender"] ? req.body["gender"] : "Male",
            firstName: req.body["firstName"],
            lastName: req.body["surName"],
            dob: new Date(req.body["dob"]),
            squadNo: req.body["squadNo"],
            league: new ObjectId(req.body["league"]),
            academy: new ObjectId(req.body["academy"]),
            team: new ObjectId(req.body["team"]),
            playerNo: playerNo,
            playerImage: req.body["playerImage"],
            emiratesIdNo: req.body["eidNo"],
            eidFront: req.body["eidFront"],
            eidBack: req.body["eidBack"],
            playerStatus: req.body["status"],
            user: new ObjectId(req.body.user["createdBy"]),
            playingUp: req.body["playingUp"],
            playingUpTeam: req.body["playingUpTeam"],
            mvp: req.body["mvp"] ? req.body["mvp"] : false,
            shortcode: req.body.shortcode,
            competition: new ObjectId(req.body["competition"]),
            createdAt: new Date()
          });

          const savedPlayer = await playerData.save();
          resp.status(200).json({
            player: savedPlayer,
            message: "Player created successfully"
          });
        } else {
          resp.status(200).json({ message: "Player already exists" });
        }
      } else {
        resp.status(200).json({ message: "Emirates is not valid" });
      }
    } else {
      resp.status(200).json({ message: "Malformed data provided" });
    }
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadPlayers = async (req, resp, next) => {
  try {
    // multiple creation
    if (req.body && Array.isArray(req.body)) {
      let bkPlayers = req.body;
      let insertedPlayers = [];
      let Players = await Player.find().exec();
      let fltPlayers = bkPlayers.filter(
        (bk) => !Players.find((p) => p.emiratesIdNo === bk["EID No"])
      );
      for (let i = 0; i < fltPlayers.length; i++) {
        fltPlayers[i]["Player ID Number"] = await getNextSequence("item_id");
        fltPlayers[i]["DOB"] = fltPlayers[i]["DOB"].includes("/")
          ? fltPlayers[i]["DOB"].split("/").reverse().join("-")
          : fltPlayers[i]["DOB"];
        const playerData = new Player({
          firstName: fltPlayers[i]["First Name"],
          lastName: fltPlayers[i]["Surname"],
          dob: new Date(fltPlayers[i]["DOB"]),
          squadNo: fltPlayers[i]["Squad Number"],
          league: new ObjectId(fltPlayers[i]["League"]),
          academy: new ObjectId(fltPlayers[i]["academy"]),
          team: new ObjectId(fltPlayers[i]["Team"]),
          playerNo: fltPlayers[i]["Player ID Number"],
          playerImage: fltPlayers[i]["playerImage"],
          emiratesIdNo: fltPlayers[i]["EID No"],
          eidFront: fltPlayers[i]["EID Front Upload"],
          eidBack: fltPlayers[i]["EID Upload Back"],
          playerStatus: "Pending",
          user: new ObjectId(fltPlayers[i].User["id"]),
          createdAt: new Date()
        });
        insertedPlayers.push(fltPlayers[i]);
        await playerData.save();
      }
      resp.status(200).json({
        message: "Players created successfully",
        players: insertedPlayers
      });
    } else {
      resp.status(200).json({ message: "Malformed data provided" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* GET all players listing. */
exports.getAllPlayers = (req, res) => {
  try {
    Player.find({})
      .populate(["user", "league", "academy", "team"])
      .sort({ createdAt: -1 })
      .exec((err, players) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        return res
          .status(200)
          .json(players.length > 0 ? players : { message: "No players found" });
      });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

/* Get employee based on id*/
exports.playerByIdOrEID = async (req, resp, next) => {
  let pl = {};
  try {
    debugger;
    console.log(req.competition);
    const { id } = req.params;
    const { shortcode } = req;
    // get the competition from coach
    const { _id } = Array.isArray(req.competition)
      ? req.competition[0]
      : req.competition;
    console.log(_id);
    if (id && id.length < 24) {
      // check if emries id or normal id
      pl = await Player.findOne({
        emiratesIdNo: id,
        shortcode: shortcode,
        competition: new ObjectId(_id) // competition id
      })
        .populate(["user", "league", "academy", "team"])
        .exec();
    } else {
      // check if emries id or normal id
      pl = await Player.find({
        _id: new ObjectId(id),
        shortcode: shortcode,
        _id: new ObjectId(_id)
      })
        .populate(["user", "league", "academy", "team"])
        .exec();
    }
    return resp.status(200).json(pl ? pl : { message: "Player not found" });
  } catch (error) {
    next(error);
  }
};

exports.playerByTeam = async (req, resp, next) => {
  let pl = {};
  try {
    const { id } = req.params;
    if (id) {
      // check if emries id or normal id
      pl = await Player.find({
        $or: [{ team: new ObjectId(id) }, { playingUpTeam: new ObjectId(id) }]
      })
        .populate(["user", "league", "academy", "team"])
        .exec();
    }
    resp.status(200).json(pl ? pl : { message: "Player not found" });
  } catch (error) {
    next(error);
  }
};

exports.forShortCode = async (req, resp, next) => {
  let pl = {};
  try {
    const { shortcode } = req.params;
    if (shortcode) {
      // check if competition
      pl = await Player.find({ shortcode: shortcode })
        .populate(["user", "league", "academy", "team"])
        .sort({ createdAt: -1 })
        .exec();
    }
    resp.status(200).json(pl ? pl : { message: "Player not found" });
  } catch (error) {
    next(error);
  }
};

exports.forCompetition = async (req, resp, next) => {
  let pl = {};
  try {
    const { competition } = req.params;
    if (competition) {
      // check if competition
      pl = await Player.find({
        competition: new ObjectId(req.params.competition)
      })
        .populate(["user", "league", "academy", "team"])
        .sort({ createdAt: -1 })
        .exec();
    }
    resp.status(200).json(pl ? pl : { message: "Player not found" });
  } catch (error) {
    next(error);
  }
};

exports.playerByAcademy = async (req, resp, next) => {
  let pl = {};
  try {
    const { id } = req.params;
    if (id) {
      // check if emries id or normal id
      pl = await Player.find({ academy: new ObjectId(id) })
        .populate(["user", "league", "academy", "team"])
        .sort({ createdAt: -1 })
        .exec();
    }
    resp.status(200).json(pl ? pl : { message: "Player not found" });
  } catch (error) {
    next(error);
  }
};

/* Edit existing employee based on id*/
exports.updatePlayer = async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchPlayer = await Player.find({ _id: new ObjectId(id) });

    if (!fetchPlayer)
      return resp.status(404).json({ msg: "Player record not found" });
    let playerObj = {};

    if (req.body.firstName) {
      playerObj = {
        ...playerObj,
        firstName: req.body.firstName
      };
    }

    if (req.body.surName) {
      playerObj = {
        ...playerObj,
        lastName: req.body.surName
      };
    }

    if (req.body.dob) {
      playerObj = {
        ...playerObj,
        dob: new Date(req.body.dob)
      };
    }

    if (req.body.academy) {
      playerObj = {
        ...playerObj,
        academy: new ObjectId(req.body.academy)
      };
    }
    if (req.body.team) {
      playerObj = {
        ...playerObj,
        team: new ObjectId(req.body.team)
      };
    }

    if (req.body.league) {
      playerObj = {
        ...playerObj,
        league: new ObjectId(req.body.league)
      };
    }

    if (req.body.competition) {
      playerObj = {
        ...playerObj,
        competition: new ObjectId(req.body.competition)
      };
    }
    if (req.body.user && req.body.user.createdBy) {
      playerObj = {
        ...playerObj,
        user: new ObjectId(req.body.user.createdBy)
      };
    }

    fetchPlayer = {
      ...fetchPlayer._doc,
      ...playerObj,
      playingUp: req.body.playingUp.map((league) => new ObjectId(league)),
      playingUpTeam: req.body.playingUpTeam.map((team) => new ObjectId(team))
    };

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      fetchPlayer,
      { new: true }
    );

    resp
      .status(200)
      .json({ player: updatedPlayer, message: "Player updated successfully" });
  } catch (error) {
    next(error);
  }
};
exports.upMvp = async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchPlayer = await Player.find({ _id: new ObjectId(id) });

    if (!fetchPlayer)
      return resp.status(404).json({ msg: "Player record not found" });
    fetchPlayer = {
      ...fetchPlayer._doc,
      ...req.body
    };

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      fetchPlayer,
      { new: true }
    );

    resp.status(200).json({
      player: updatedPlayer,
      message: "Player MVP updated successfully"
    });
  } catch (error) {
    next(error);
  }
};
exports.approveMulitplePlayers = async (req, resp, next) => {
  try {
    console.log(req.body);
    const players = req.body;
    let i = 0;
    while (i < players.length) {
      let fetchPlayer = await Player.find({ _id: new ObjectId(players[i]) });

      if (fetchPlayer) {
        fetchPlayer = {
          ...fetchPlayer,
          playerStatus: "Approved"
        };
        await Player.findByIdAndUpdate(players[i], fetchPlayer, { new: true });
      }
      i++;
    }
    resp.status(200).json({ message: "Players updated successfully" });
  } catch (error) {
    next(error);
  }
};
/* Edit existing employee based on id*/
exports.approvePlayer = async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchPlayer = await Player.find({ _id: new ObjectId(id) });

    if (!fetchPlayer)
      return resp.status(404).json({ message: "Player record not found" });
    fetchPlayer = {
      ...fetchPlayer,
      playerStatus: req.body.playerStatus
    };
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      fetchPlayer,
      { new: true }
    );

    resp.status(200).json(updatedPlayer);
  } catch (error) {
    next(error);
  }
};

/* Delete employee based on id*/
exports.deletePlayer = async (req, resp, next) => {
  try {
    const player = await Player.findByIdAndDelete({
      _id: new ObjectId(req.params.id)
    });
    if (!player) {
      return resp
        .status(200)
        .json({ type: "error", message: `Player record not found!` });
    }
    resp.status(200).json({
      type: "success",
      message: `Player ${player.firstName} record deleted!`
    });
  } catch (error) {
    next(error);
  }
};

/* Delete all Players*/
exports.deleteAllPlayers = async (req, resp, next) => {
  try {
    const pl = await Player.remove({});
    resp.status(200).json({ msg: `All players records has been deleted!` });
  } catch (error) {
    next(error);
  }
};
