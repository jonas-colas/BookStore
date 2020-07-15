import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Register from './user/Register';
import Login from './user/Login';
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Orders from './admin/OrdersAdmin';
import Profile from './user/UserProfile';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';


const Routes = () => {
	return (
		<BrowserRouter>
			
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/shop" exact component={Shop} />
				<Route path="/cart" exact component={Cart} />
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
				<Route path="/product/:productId" exact component={Product} />
				<PrivateRoute path="/user/dashboard" exact component={Dashboard} />
				<PrivateRoute path="/profile/:userId" exact component={Profile} />
				<AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
				<AdminRoute path="/category/create" exact component={AddCategory} />
				<AdminRoute path="/product/create" exact component={AddProduct} />
				<AdminRoute path="/admin/orders" exact component={Orders} />
				<AdminRoute path="/admin/products" exact component={ManageProducts} />
				<AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct} />
			</Switch>
		</BrowserRouter>
	);
};

export default Routes;