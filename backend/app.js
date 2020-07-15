const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');


require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute');
const braintreeRoutes = require('./routes/braintreeRoute');
const orderRoutes = require('./routes/orderRoute');

//db
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).catch(error => console.log(error.reason));

mongoose.connection.on('connected', () => {
	console.log('Database connection is successful !!!');
});

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(expressValidator());

//routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});