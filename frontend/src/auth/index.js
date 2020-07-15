import {API} from '../config';

export const register = (user) => {
	//console.log(name, email, password);
	return fetch(`${API}/signup`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type':'application/json'
		},
		body: JSON.stringify(user)
	})
	.then(response => {
		return response.json();
	})
	.catch(error => {
		console.log(error);
	});
};

export const login = (user) => {
	//console.log(name, email, password);
	return fetch(`${API}/login`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type':'application/json'
		},
		body: JSON.stringify(user)
	})
	.then(response => {
		return response.json();
	})
	.catch(error => {
		console.log(error);
	});
};


export const authenticate = (data, next) => {
	if(typeof window !== 'undefined'){
		localStorage.setItem('jwt', JSON.stringify(data));
		next();
	}
};


export const logout = (next) => {
	if(typeof window !== 'undefined'){
		localStorage.removeItem('jwt');
		next();
		return fetch(`${API}/logout`, {
			method: 'POST'
		}).then(response => {
			//console.log('logout', response);
			console.log('logout');
		}).catch(error => console.log('err'));
	}
};


export const isAuthenticated = () => {
	if(typeof window == 'undefined'){
		return false;
	}

	if(localStorage.getItem('jwt')){
		return JSON.parse(localStorage.getItem('jwt'));
	}else{
		return false;
	}
};