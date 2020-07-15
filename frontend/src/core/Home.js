import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getProducts} from './apiCore';
import Card from './Card';
import Search from './Search';

const Home = () => { 
	const [productsBySell, setproductsBySell] = useState([]);
	const [productsByArrival, setproductsByArrival] = useState([]);
	const [error, setError] = useState(false);

	const loadProductsBySell = () => {
		getProducts('sold').then(data => {
			if(data.error){
				setError(data.error);
			}else{
				//console.log(data);
				setproductsBySell(data);
			}
		});
	};
	
	const loadProductsByArrival = () => {
		getProducts('createdAt').then(data => {
			if(data.error){
				setError(data.error);
			}else{
				//console.log(data);
				setproductsByArrival(data);
			}
		});
	};

	useEffect(() => {
		loadProductsBySell();
		loadProductsByArrival();
	}, []);

	return (
		<Layout title="Home Page" description="Node React Ecommerce App" className="container-fluid">
			<Search />
			<h2 className="mb-4">Best Sellers</h2>
			<div className="row">
				{productsBySell.map((product, i) => (
					<div className="col-4 mb-3" key={i}>
						<Card product={product} /> 
					</div>
				))}
			</div>

			<h2 className="mb-4">New Arrival</h2>
			<div className="row">
				{productsByArrival.map((product, i) => (
					<div key={i} className="col-4 mb-3">
						<Card product={product} /> 
					</div>
				))}
			</div>

		</Layout>
	);
};

export default Home;