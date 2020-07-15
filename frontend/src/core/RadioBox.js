import React, {useState, useEffect, Fragment} from 'react';

const RadioBox = ({prices, handleFilters}) => {
	const [value, setValue] =useState([]);
	
	const handleChange = (event) => {
		handleFilters(event.target.value);
		setValue(event.target.vallue);
	};

	return prices.map((p, i) => (
		<div key={i}>
			<input type="radio" onChange={handleChange} value={`${p._id}`} name={p} className="mr-2 ml-4" />
			<label className="form-check-label">{p.name}</label>
		</div>
	));

	
};

export default RadioBox;