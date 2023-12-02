const ObjectId = require('mongodb').ObjectId;
const db = require("../models");
const Compitition = db.compitition;

/* Add new fixture*/
exports.createCompitition = async (req, resp, next) => {
   try {
    // multiple creation
    if(req.body && Array.isArray(req.body)) {
      let insertedCompititions = [];
      for (let i = 0; i < req.body.length; i++) {       
        if(req.body[i]['compititionName']) {
            const compititionData = new Compitition({
                compititionName: req.body[i]['compititionName'],
                organiserDetail: req.body[i]['organiserDetail'],
                shortCode: req.body[i]['shortCode'],
                compititionLogo: req.body[i]['compititionLogo'],
                compitionSettings: req.body[i]['compitionSettings'],
                compitionSeason: req.body[i]['compitionSeason'],
                compititionStart: req.body[i]['compititionStart'],
                compititionEnd: req.body[i]['compititionEnd'],
                user_id: ObjectId(req.body[i].user['createdBy']),
                createdAt:  new Date()
            });
            insertedCompititions.push(req.body[i]);
            await compititionData.save();
          };
        }
      resp.status(200).json(insertedCompititions);
    } else if(req.body['compititionName']) {
        const compititionData = new Compitition({
            compititionName: req.body['compititionName'],
            organiserDetail: req.body['organiserDetail'],
            shortCode: req.body['shortCode'],
            compititionLogo: req.body['compititionLogo'],
            compitionSettings: req.body['compitionSettings'],
            compitionSeason: req.body['compitionSeason'],
            compititionStart: req.body['compititionStart'],
            compititionEnd: req.body['compititionEnd'],
            createdAt:  new Date()
        });
        insertedCompititions.push(req.body);
        await compititionData.save();
      };    
  } catch (error) {
    next(error);
  }
};


/* GET all Compititions listing. */
exports.getAllCopititions =  async (req, resp, next) => {
  try {
    const compitition = await Compitition.find({});
    resp.status(200).json( compitition.length > 0 ? compitition : { message: 'No compitition found' });
  } catch (error) {
    next(error);
  }

};

/* Get compitition based on id*/
exports.getCompititionById = async (req, resp, next) => {
  try {
    const compitition = await Compitition.find({ _id: ObjectId(req.params.id) });
    resp.status(200).json(compitition);
  } catch (error) {
    next(error);
  }
};

/* Edit existing fixture based on id*/
exports.updateCompitition=  async (req, resp, next) => {

  try {
    if(req.params && req.params.id) {
    let fetchCompitition = await Compitition.find({_id: ObjectId(req.params.id)});

    if (!fetchCompitition) return resp.status(404).json({ msg: 'Compitition record not found' });

    fetchCompitition = {
      ...fetchCompitition._doc,
      ...req.body
    }

    const updatedCompitition = await Compitition.findByIdAndUpdate(req.params.id, fetchCompitition, { new: true });

    resp.status(200).json(updatedCompitition);
  } else {
    resp.status(200).json({ message: 'Compitition id is not valid or not found' });
  }

  } catch (error) {
    next(error);
  }
};


/* Delete compitition based on id*/
exports.deleteCompitition = async (req, resp, next) => {
  try {
    const compitition = await Compitition.findByIdAndDelete({_id: ObjectId(req.params.id)} );
    resp.status(200).json({ message: `Compitition has been record deleted! ${compitition.compititionName}`})
  } catch (error) {
    next(error);
  }
};

/* Delete all Compitition*/
exports.deleteAllCompitition =  async (req, resp, next) => {

  try {
    const compitition = await Compitition.deleteMany({});;
    console.log(compitition, "::: deleted records")
    resp.status(200).json({ message: `All compititions records has been deleted!`})
  } catch (error) {
    next(error);
  }

};