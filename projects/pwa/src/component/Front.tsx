import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';

export interface FrontProps {
	product: string;
	edition: string;
	front: string;
}

const Front = ({ product, edition, front }: FrontProps) => {
	return (
		<div>
			<h2>{front} Front</h2>
			<ul>
				<li>
					<Link to={urlBuilder(product, edition, front, 'otters')}>
						Otter story
					</Link>
				</li>
				<li>
					<Link to={urlBuilder(product, edition, front, 'skiing')}>
						Skiing story
					</Link>
				</li>
			</ul>
			<p>{edition}</p>
			<p>{product}</p>
		</div>
	);
};

export default Front;
