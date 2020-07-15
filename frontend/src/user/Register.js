import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../core/Layout';
import {register} from '../auth';

const Register = () => {
	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		success: false
	});

	const {name, email, password, success, error} = values;

	const handleChange = name => event => {
		setValues({...values, error: false, [name]: event.target.value})
	};

	//

	const clickSubmit = (event) => {
		event.preventDefault();
		setValues({...values, error: false});
		register({name, email, password}).then(data => {
			if(data.error){
				setValues({...values, error: data.error, success: false})
			}else{
				setValues({
					...values,
					name: '',
					email: '',
					password: '',
					error: '',
					success: true
			  });
			}
		});
	};

	const registerForm = () => (
		<form>
			<div className="form-group">
				<label className="text-muted">Name</label>
				<input type="text" onChange={handleChange('name')} value={name} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">Email</label>
				<input type="email" onChange={handleChange('email')} value={email} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">Password</label>
				<input type="password" onChange={handleChange('password')} value={password} className="form-control" />
			</div>
			<button onClick={clickSubmit} className="btn btn-primary"> Register</button>
		</form>
	);

	const showError = () => (
		<div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
			{error}
		</div>
	);

	const showSuccess = () => (
		<div className="alert alert-info" style={{display: success ? '' : 'none'}}>
			New account is created. Please <Link to='/login'>Login</Link>
		</div>
	);

	return (
		<Layout title="Register" description="Register to Node React Ecommerce App" className="container col-md-8 offset-md-2">
			{showSuccess()}
			{showError()}
			{registerForm()}
		</Layout>
	);
};
export default Register;
