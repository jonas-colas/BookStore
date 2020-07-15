const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
	category: {type: ObjectId, ref: 'Category', required: true},
	name: {type: String, trim: true, required: true, maxlength: 32},
	description: {type: String, required: true, maxlength: 255},
	price: {type: Number, trim: true, required: true, maxlength: 32},
	picture: {data: Buffer, contentType: String},
	stock: {type: Number, default: 1},
	sold: {type: Number, default: 0},
}, {timestamps: true});


module.exports = mongoose.model('Product', productSchema);