const { EDESTADDRREQ } = require('constants');
const Category = require('../models/Category');
const errorHandler = require('../utils/errorHandler');

module.exports.getAllStatic = async function(req, res) {
  try {
    let categories = await Category.find({user: req.user.id})
    await res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json(error);
    errorHandler(res, error)
  }
};

module.exports.getAll = async function(req, res) {

  let params = {
    search: req.query.search,
    page: +req.query.page,
    limit: +req.query.limit,
    sort: req.query.sort,
    order: req.query.order
  }

  const searchMongoose = {
    $text: { $search: new RegExp(params.search, "i") },
  };

  const query = params.search == "" ? {} : searchMongoose  ;
  const selectFields = ["id","name", "title", "description", "imageSrc"];

  let skipParams = 0;

  if(+params.page === 1) {
    skipParams = 0;
  } else
  if(+params.page === 2) {
    skipParams = params.limit;
  } else {
    skipParams = params.page * params.limit - params.limit;
  } 
  
  const sorting = {
    skip: Math.abs(skipParams),
    limit: params.limit,
    sort: { [params.sort]: params.order },
  };
  
  try {
    let categories = await Category.find(query, selectFields, sorting)
    let totalCategory = await Category.find().countDocuments();
    let currentLenCategory = await Category.find(query).countDocuments();
    console.log('currentLenCategory',currentLenCategory)
    console.log('currentLenCategory',categories)
    await res.status(200).json({ categories, totalCategory });
  } catch (error) {
    res.status(400).json(error);
    errorHandler(res, error)
  }
};

module.exports.getById = async function(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.status(201).json(category);
  } catch (error) {
    res.status(201).json(error);
    errorHandler(res, error)
  }
};

module.exports.create = async function(req, res) {
  try {
    const category = await Category({
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      imageSrc: req.file ? req.file.path : '',
      user: req.user.id,
    })
    category.save()
    res.status(201).json(category);
  } catch (error) {
    res.status(401).json(error);
    errorHandler(res, error)
  }
  
};

module.exports.update = async function(req, res) {
  let updated = {
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    user: req.user.id,
  };
  if (req.file) {
    updated.imageSrc = req.file.path
  }
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );
  
    res.status(201).json(category);
  } catch (error) {
    res.status(401).json(error);
    errorHandler(res, error)
  }

};

module.exports.remove = async function(req, res) {
  try {
    await Category.remove({ _id: req.params.id });
    res.status(201).json({ message: 'Категория удаленна.' });
  } catch (error) {
    res.status(400).json(error);
    
  }
};
