import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Link, Redirect} from 'react-router-dom';
import {getProduct, getCategories, updateProduct} from './apiAdmin';


const UpdateProduct = ({match}) => {
	const [values, setValues] = useState({
		name: '', description: '', price: '', categories: [], category: '', stock: '',
		picture: '', loading: false, error: '', createdProduct: '', redirectToProfile: false, formData: ''
	});

	//desctructure user and token from localStorage
	const {user, token} = isAuthenticated();

	const {name, description, price, categories, category, 
		stock, picture, loading, error, createdProduct, redirectToProfile, formData} = values;

	const init = (productId) => {
		getProduct(productId).then(data => {
			if(data.error){
				setValues({...values, error: data.error});
			}else{
				//populate the state and load categories
				setValues({...values, name: data.name, description: data.description, price: data.price,
				 category: data.category, stock: data.stock, formData: new FormData() });
				initCategories();
			}
		})
	};
	//load categories and set form data
	const initCategories = () => {
		getCategories().then(data => {
			if(data.error){
				setValues({...values, error: data.error});
			}else{
				console.log(data);
				setValues({categories: data, formData: new FormData() });
			}
		});
	};

	useEffect(() => {
		//initCategories();
		init(match.params.productId);
	}, []);

	const handleChange = name => event => {
		const value = name === 'picture' ? event.target.files[0] : event.target.value;
		formData.set(name, value);
		setValues({...values, [name]: value});
	};

	const clickSubmit = event => {
		event.preventDefault();
		setValues({ ...values, error: '', loading: true });
		
		//make request to api to create category
		updateProduct(match.params.productId, user._id, token, formData).then(data => {
			if(data.error){
				setValues({...values, error: data.error});
			}else{
				setValues({...values, name: '', description: '', picture: '', price: '', stock: '',
				 loading: false, error: false, redirectToProfile: true, createdProduct: data.name });
			}
		});
	};

	const newPostForm = () => (
		<form onSubmit={clickSubmit} className="mb-3">
			<h4>Post Picture</h4>
			<div className="form-group">
				<label className="btn btn-secondary">
					<input type="file" onChange={handleChange('picture')} name="picture" accept="image/*" />
				</label>
			</div>
			<div className="form-group">
				<label className="text-muted">Name</label>
				<input type="text" onChange={handleChange('name')} value={name} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">Description</label>
				<textarea type="text" onChange={handleChange('description')} value={description} className="form-control" ></textarea>
			</div>
			<div className="form-group">
				<label className="text-muted">Price</label>
				<input type="number" onChange={handleChange('price')} value={price} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">category</label>
				<select onChange={handleChange('category')} className="form-control">
					<option>Please select</option>
					{categories && categories.map((c, i) => (
							<option key={i} value={c._id}>{c.name}</option>
						))
					}
				</select>
			</div>
			<div className="form-group">
				<label className="text-muted">Stock</label>
				<input type="number" onChange={handleChange('stock')} value={stock} className="form-control" />
			</div>
			<button className="btn btn-outline-primary">Update Product</button>
		</form>
	);

	const showSuccess = () => (
		<div className="alert alert-success" style={{display: createdProduct ? '' : 'none'}}>
			<h2>{`${createdProduct}`} is updated !</h2>
		</div>
	);

	const showLoading = () => (
		loading &&	(<div className="alert alert-success"> <h2>Loading...</h2> </div>)
	);

	const redirectUser = () => {
		if(redirectToProfile){
			if(!error){
				return <Redirect to="/" />
			}
		}
	};

	const showError = () => (
		<div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
			{error}
		</div>
	);

	const goBack = () => (
		<div className="mt-5">
			<Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>
		</div>
	);

	return (
		<Layout title="Add a new Product" description={`G'day ${user.name}, ready to add a new product`}>
			<div className="row">
				<div className="col-md-8 offset-md-2">
					{showLoading()}
					{showSuccess()}
					{showError()}
					{newPostForm()}
					{redirectUser()}
					{goBack()}
				</div>
			</div>
		</Layout>
	);
};

export default UpdateProduct;