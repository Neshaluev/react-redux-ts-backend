const Product = require('../models/Product');
const errorHandler = require('../utils/errorHandler');

module.exports.getAllById = async function(req, res) {
  let id = req.query.category
  try {
    const products = await Product.find({ category: id });
    await res.status(200).json({ products });
  } catch (error) {
    res.status(400).json(error);
    errorHandler(res, error)
  }
}

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
  const selectFields = ["name", "title","category","price","height","width","comment", "description", "imageSrc"];

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
    let products = await Product.find(query,selectFields, sorting);
    let totalProducts = await Product.find().countDocuments();
    await res.status(200).json({ products, totalProducts });
  } catch (error) {
    res.status(400).json(error);
    errorHandler(res, error)
  }
};

module.exports.getById = async function(req, res) {
  try {
    const category = await Product.findOne({ _id: req.params.id });
    res.status(201).json(category);
  } catch (error) {
    res.status(201).json(error);
    errorHandler(res, error)
  }
};

module.exports.create = async function(req, res) {
  console.log('Create req.body', req.body)
  try {
    const product = await Product({
      name: req.body.name,
      title: req.body.title,
      category: req.body.category,
      imageSrc: req.file ? req.file.path : '',
      price: req.body.price,
      height: req.body.height,
      width: req.body.width,
      comment: req.body.comment,
      description: req.body.description,
      user: req.user.id,
    })
    product.save()
    res.status(201).json(product);
  } catch (error) {
    res.status(401).json(error);
    errorHandler(res, error)
  }
  
};

module.exports.update = async function(req, res) {
  let updated = {
    name: req.body.name,
    title: req.body.title,
    category: req.body.category,
    price: req.body.price,
    height: req.body.height,
    width: req.body.width,
    comment: req.body.comment,
    description: req.body.description,
    user: req.user.id,
  };
  if (req.file) {
    updated.imageSrc = req.file.path
  }
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );
  
    res.status(201).json(product);
  } catch (error) {
    res.status(401).json(error);
    errorHandler(res, error)
  }

};

module.exports.remove = async function(req, res) {
  try {
    await Product.remove({ _id: req.params.id });
    res.status(201).json({ message: 'Категория удаленна.' });
  } catch (error) {
    res.status(400).json(error);
    
  }
};
