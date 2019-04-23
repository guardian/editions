import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';

export interface ProductProps {
	product: string;
}

const Product = ({ product }: ProductProps) => {
	return (
		<div>
			<h2>{product} edition</h2>
			<ul>
				<li>
					<Link to={urlBuilder(product, 'saturday')}>Saturday edition</Link>
				</li>
				<li>
					<Link to={urlBuilder(product, 'sunday')}>Sunday edition</Link>
				</li>
			</ul>
		</div>
	);
};

export default Product;
