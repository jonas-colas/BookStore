import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import {addItem, updateItem, removeItem} from './cartHelpers';

const Card = ({
	product, showViewButton=true, addToCartButton=true, cartUpdate=false, removeProduct=false,
	setRun = f => f, // default value of function
  run = undefined // default value of undefined
}) => {

	const [redirect, setRedirect] = useState(false);
	const [count, setCount] = useState(product.count);

	const viewButton  = showViewButton => {
		return (
			showViewButton && (
				<Link to={`/product/${product._id}`} className="mr-2"> 
					<button className="btn btn-outline-primary mt-2 mb-3 mr-2"> View Product </button>
				</Link>
			)
		);
	};

	const addToCart = () => {
		addItem(product, setRedirect(true));
	};

	const shouldRedirect = redirect => {
		if(redirect){
			return <Redirect to="/cart" />
		}
	};

	const showAddToCartButton = addToCartButton => {
		return ( 
			addToCartButton && (
				<button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-3"> add to cart </button>
			)
		);
	};


	const showRemoveProductButton = removeProduct => {
		return ( 
			removeProduct && (
				<button onClick={() => {removeItem(product._id);  setRun(!run);}} 
					className="btn btn-outline-danger mt-2 mb-3"> 
					remove product 
				</button>
			)
		);
	};

	const showStock = stock => {
		return stock > 0 ? (<span className="badge badge-primary badge-pill">In stock</span>
		) : (<span className="badge badge-danger badge-pill">Out of stock</span>);
	};

	const handleChange = productId => event => {
		setRun(!run); // run useEffect in parent Cart
		setCount(event.target.value < 1 ? 1 : event.target.value);
		if(event.target.value >= 1){
			updateItem(productId, event.target.value);
		}
	};

	const showCartUpdateOptions = cartUpdate => {
		return (cartUpdate && (
				<div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">Adjust Qty</span>
						</div>
						<input type="number" className="form-control" value={count} 
						onChange={handleChange(product._id)} />
					</div>
				</div>
			)
		);
	};

	return (
		<div className="card">
			<div className="card-header name"> {product.name}</div>
			<div className="card-body">

				{shouldRedirect(redirect)}
				
				<ShowImage item={product} url="product" />
				<p className="lead mt-2" >{product.description.substring(0, 100)}</p>
				<p className="black-10">${product.price}</p>
				<p className="black-9">Category: {product.category && product.category.name}</p>
				<p className="black-8">
					Added on {moment(product.createdAt).fromNow()}
				</p>

				{showStock(product.stock)}
				<br/>

				{viewButton(showViewButton)} 
				
				{showAddToCartButton(addToCartButton)} 
				
				{showCartUpdateOptions(cartUpdate)} 
				
				{showRemoveProductButton(removeProduct)} 
		 		
		 </div>
		</div>
	);
};

export default Card;