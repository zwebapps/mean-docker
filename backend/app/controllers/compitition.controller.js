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
                organiser: req.body[i]['organiser'],
                shortCode: req.body[i]['shortCode'],
                compititionLogo: req.body[i]['compititionLogo'],
                compititionSettings: req.body[i]['compititionSettings'],
                compititionSeason: req.body[i]['compititionSeason'],
                compititionCountry: req.body[i]['compititionCountry'],
                compititionYear: req.body[i]['compititionYear'],
                compititionStart: req.body[i]['compititionStart'],
                compititionEnd: req.body[i]['compititionEnd'],
                user_id: ObjectId(req.body[i].user['createdBy']),
                createdAt:  new Date()
            });
            const savedCompitition = await compititionData.save();
            insertedCompititions.push(savedCompitition);
          };
        }
      return resp.status(200).json(insertedCompititions);
    } else if(req.body['compititionName']) {
        const compititionData = new Compitition({
          compititionName: req.body['compititionName'],
          organiser: req.body['organiser'],
          shortCode: req.body['shortCode'],
          compititionLogo: req.body['compititionLogo'],
          compititionSettings: req.body['compititionSettings'],
          compititionSeason: req.body['compititionSeason'],
          compititionCountry: req.body['compititionCountry'],
          compititionYear: req.body['compititionYear'],
          compititionStart: req.body['compititionStart'],
          compititionEnd: req.body['compititionEnd'],
          user_id: ObjectId(req.body.user['createdBy']),
          createdAt:  new Date()
        });
        await compititionData.save();
        return resp.status(200).json({ message: 'Compitition has been created successfully!'});
      };    
  } catch (error) {
    return resp.status(400).json({ message: 'Competition creation failed!'+ error });
  }
};


/* GET all Compititions listing. */
exports.getAllCompititions =  async (req, resp, next) => {
  try {
    const compitition = await Compitition.find({}).populate(["organiser", "user_id"]).exec();
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

exports.getCompititionByName = async (req, resp, next) => {
  try {
    const compitition = await Compitition.find({ compititionName: req.params.name });
    return resp.status(200).json( compitition? compitition: { message: 'No compitition found' });
  } catch (error) {
    next(error);
  }
};
exports.getCompititionByShortCode = async (req, resp, next) => {
  try {
    const compitition = await Compitition.find({ shortCode: req.params.shortcode });
    return resp.status(200).json( compitition? compitition: { message: 'No compitition found' });
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
exports.deleteAllCompititions =  async (req, resp, next) => {

  try {
    const compitition = await Compitition.deleteMany({});;
    console.log(compitition, "::: deleted records")
    resp.status(200).json({ message: `All compititions records has been deleted!`})
  } catch (error) {
    next(error);
  }

};