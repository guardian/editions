import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';

export interface EditionProps {
	product: string;
	edition: string;
}

const Edition = ({ product, edition }: EditionProps) => {
	return (
		<div>
			<h2>{edition} edition</h2>
			<ul>
				<li>
					<Link to={urlBuilder(product, edition, 'sports')}>Sports front</Link>
				</li>
				<li>
					<Link to={urlBuilder(product, edition, 'lifestyle')}>
						Lifestyle front
					</Link>
				</li>
			</ul>
			<p>{product}</p>
		</div>
	);
};

export default Edition;
