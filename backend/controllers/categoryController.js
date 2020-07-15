const Category = require('../models/categoryModel');


exports.categoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, category) => {
		if(err || !category){
			return res.status(400).json({
				error: 'Category does not exist'
			});
		}
		req.category = category;
		next();
	});
};



exports.allCategories = (req, res) => {
	Category.find().exec((err, categories) => {
		if(err){
			return res.status(400).json({
				error : 'Cannot list any category'
			});
		}
		res.json(categories);
	});
};


exports.create = (req, res, next) => {
	const category = new Category(req.body);
	category.save().then(category => {
		//console.log(category);	
		res.status(201).json({
			message: 'Category created successfully!',
			createdCategory:{
				_id: category._id,
				name: category.name,
				request:{
					type: 'GET',
					url: 'http://localhost:8000/category/' + category._id
				}
			}
		});
	}).catch(err => {
		//console.log(err);
		res.status(400).json({
			//message: 'Cannot create category'
			error: err
		});
	});
};


exports.oneCategory = (req, res) => {
	return res.json(req.category);
};

exports.update = (req, res) => {
	const category = req.category;
	category.name = req.body.name;
	category.save().then(category => {
		console.log(category);
		res.status(200).json({
			message: 'Category updated successfully!',
			category: category
		});
	}).catch(err => {
		res.status(400).json({
			error: err
		})
	});
};

exports.remove = (req, res) => {
	const category = req.category;
	category.remove().then(result => {
		res.status(200).json({
			message: 'Category deleted!'
		});
	}).catch(err => {
		res.status(400).json({
			error: 'Cannot delete category'
		});
	});
};


