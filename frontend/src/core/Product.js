import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import Card from './Card';
import {read, listRelated} from './apiCore';


const Product = (props) => {
	const [product, setProduct] = useState({});
	const [relatedProduct, setRelatedProduct] = useState([]);
	const [error, setError] = useState(false);

	const loadingSingleProduct = productId => {
		read(productId).then(data => {
			if(data.error){
				setError(data.error);
			}else{
				setProduct(data);
				//and fetch related products
				listRelated(data._id).then(data => {
					if(data.error){
						setError(data.error);
					}else{
						setRelatedProduct(data);
					}
				})
			}
		})
	};

	useEffect(() => {
		const productId = props.match.params.productId;
		loadingSingleProduct(productId);
	}, [props])

	return (
		<Layout title={product && product.name} 
		description={product && product.description && product.description.substring(0, 100)} className="container-fluid">
			{/*<div className="row">*/}
				<div className="col-6 mb-3">
					<div className="row">
						<div className="col-8">
							{product && product.description && <Card product={product} showViewButton={false} />}
						</div>
						<div className="col-4">
							<h4>Related Products</h4>
							{relatedProduct.map((p, i) => (
								<div className="mb-3">
									{product && product.description && <Card product={p} />}
								</div>
							))}
						</div>
					</div>
				</div>
			{/*</div>*/}
		</Layout>
	);
};

export default Product;