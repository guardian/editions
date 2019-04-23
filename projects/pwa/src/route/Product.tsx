import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Content from '../component/Content';

export interface ProductProps {
	product: string;
}

const Product = ({ product }: ProductProps) => {
	return (
		<div>
			<Header>{product} Guardian</Header>
			<Content>
				<ul>
					<li>
						<Link to={urlBuilder(product, 'saturday')}>Saturday edition</Link>
					</li>
					<li>
						<Link to={urlBuilder(product, 'sunday')}>Sunday edition</Link>
					</li>
				</ul>
			</Content>
		</div>
	);
};

export default Product;
