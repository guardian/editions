import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';

export interface FrontProps {
	product: string;
	edition: string;
	front: string;
}

const Front = ({ product, edition, front }: FrontProps) => {
	return (
		<div>
			<Header backLink={urlBuilder(product, edition)}>{front} Front</Header>
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
