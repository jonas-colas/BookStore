const {Order, CartItem} = require('../models/orderModel');

exports.orderById = (req, res, next, id) => {
	Order.findById(id).populate('products.product', 'name price').exec((err, order) => {
		if(err || !order){
			return res.status(400).json({
				error: 'cannot find order'
			});
		}
		req.order = order;
		next();
	});
};

exports.create = (req, res) => {
	req.body.order.user = req.profile;
	const order = new Order(req.body.order);
	order.save((error, data) => {
		if(error){
			return res.status(400).json({
				error: 'Cannot save order'
			});
		}
		res.json(data);
	});	
};

exports.listOrders = (req, res) => {
	Order.find().populate('user', '_id name address').sort('-created').exec((err, orders) => {
		if(err){
			return res.status(400).json({
				error: 'Cannot show orders'
			});
		}
		res.json(orders);
	});
};


exports.getStatusValues = (req, res) => {
	//res.json(Order.Schema.path('status').enumValues);
};


exports.updateOrderStatus = (req, res) => {
	Order.update(
		{_id: req.body.orderId},
		{$set: {status: req.body.status}}, 
		(err, order) => {
			if(err){
				return res.status(400).json({
					error: 'Cannot update status'
				});
			}
			res.json(order);
		}
	);
};

