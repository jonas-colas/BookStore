const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/productModel');


//Sell / arrival
//by sell = /products?sortBy=sold&order=desc&limit=4
//by arrival = /products?sortBy=createdAd&order=desc&limit=4
//if no params are sent, then all products are returned

exports.allProducts = (req, res) => {
	let order = req.query.order ? req.query.order : 'asc';
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	let limit = req.query.limit ? parseInt(req.query.limit) : 6;

	Product.find().select('-picture').populate('category').sort([[sortBy, order]])
	.limit(limit).exec((err, products) => {
		if (err) {
			return res.status(400).json({
				error: 'Products not found'
			});
		}
		res.json(products);
	});
};

exports.listSearch = (req, res) => {
	//Create query object to hold search value and category value
	const query = {};
	//assign search value to query.name
	if(req.query.search){
		query.name = {$regex: req.query.search, $options: 'i'};
		//assign category value to query.category
		if(req.query.category && req.query.category != 'All'){
			query.category = req.query.category;
		}

		//find the product based on query object with 2 properties
		//search and category
		Product.find(query, (err, products) => {
			if(err){
				return res.status(400).json({
					error : 'error'
				})
			}
			res.json(products);
		}).select('-picture');
	}

};


exports.productById = (req, res, next, id) => {
	Product.findById(id).populate('category').exec((err, product) =>{
		if (err || !product) {
			return res.status(400).json({
				error: 'Product not found'
			});
		}
		req.product = product;
		next();
	});
};


exports.read = (req, res) =>{
	req.product.picture = undefined;
	return res.json(req.product);
};


exports.create = (req, res, next) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res,status(400).json({
				error: 'Image could not be uploaded'
			});
		}

		const {name, description, price, category, stock} = fields;
		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
					error: 'All fields are required'
				});
		}

		let product = new Product(fields);
		
		if (files.picture) {
			//console.log('FILES PICTURE', files.picture);
			if (files.picture.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size'
				});
			}
			product.picture.data = fs.readFileSync(files.picture.path);
			product.picture.contentType = files.picture.type;
		}
		product.save().then(product => {
			res.status(201).json({
				message: 'Product created successfully!',
				createdProduct:{
					_id: product._id,
					name: product.name,
					category: product.category,
					description: product.description,
					price: product.price,
					picture: product.picture,
					name: product.name,
					request:{
						type: 'GET',
						url: 'http://localhost:8000/product/' + product._id
					}
				}
			});
		}).catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	});
};

exports.update = (req, res, next) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res,status(400).json({
				error: 'Image could not be uploaded'
			});
		}

		/*const {name, description, price, category, stock} = fields;
		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
					error: 'All fields are required'
				});
		}*/

		let product =  req.product;
		product = _.extend(product, fields);
		
		if (files.picture) {
			//console.log('FILES PICTURE', files.picture);
			if (files.picture.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size'
				});
			}
			product.picture.data = fs.readFileSync(files.picture.path);
			product.picture.contentType = files.picture.type;
		}
		product.save().then(product => {
			res.status(201).json({
				message: 'Product updated successfully!',
				createdProduct:{
					_id: product._id,
					name: product.name,
					category: product.category,
					description: product.description,
					price: product.price,
					picture: product.picture,
					name: product.name,
					request:{
						type: 'GET',
						url: 'http://localhost:8000/product/' + product._id
					}
				}
			});
		}).catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	});
};


exports.remove = (req, res, next) => {
	let product = req.product;
	product.remove().then(result => {
		res.status(200).json({
			message: 'Product deleted!'
		});
	}).catch(err => {
		res.status(500).json({
			error: err
		});
	});
};

//it will find the products based on the request product category
//other products that has the same category, will be returned
exports.listRelated = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 6;

	Product.find({_id: {$ne: req.product}, category: req.product.category}).limit(limit)
	.populate('category', '_id name').exec((err, products) => {
		if (err) {
			return res.status(400).json({
				eror: 'Product not found'
			});
		}
		res.json(products); 
	});
};


exports.categoriesByProduct = (req, res) => {
	Product.distinct('category', {}, (err, categories) => {
		if (err) {
			return res.status(400).json({
				eror: 'Category not found'
			}); 
		}
		res.json(categories);
	});
};

/*
*list products by search
*we will implement products search in react frontend
*we will show categories in checkbox and price range in radio buttons
*as the user clicks on those checkbox and radio buttons
*we will make api request and show the products to users based on what he wants
*/
exports.productBySearch = (req, res) => {
	let order = req.body.order ? req.body.order : 'desc';
	let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
	let limit = req.body.limit ? parseInt(req.body.limit) : 100;
	let skip = parseInt(req.body.skip);
	let findArgs = {};

	//console.log(order, sortBy, limit, skip, req.body.filters);
	//console.log("findArgs", findArgs);

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === 'price') {
				//gte - greater than price [0 -10]
				//lte - less than
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			}else{
				findArgs[key] = req.body.filters[key];
			}
		}
	}

	Product.find(findArgs).select('-picture').populate('category')
	.sort([[sortBy, order]]).skip(skip).limit(limit).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: 'Products not found'
			});
		}
		res.json({
			size: data.length,
			data
		});
	});
};


exports.picture = (req, res) => {
	if (req.product.picture.data) {
		res.set('Content-Type', req.product.picture.contentType);
		return res.send(req.product.picture.data);
		next();
	}
};


exports.decreaseStock = (req, res, next) => {
	let bulkOps = req.body.order.products.map((item) => {
		return {
			updateOne:{filter:{_id:item._id}, update:{$inc:{ stock: -item.count, sold: +item.count}}}
		}
	});

	Product.bulkWrite(bulkOps, {}, (error, products) => {
		if(error){
			return res.status(400).json({
				error: 'Could not update product'
			});
		}
		next();
	});
};