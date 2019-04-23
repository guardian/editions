import React from 'react';
import useArticle from '../hooks/useArticle';
import Header from '../component/Header';
import { urlBuilder } from '../helper/urlBuilder';

export interface ArticleProps {
	product: string;
	edition: string;
	front: string;
	article: string;
}

const Article = ({ product, edition, front, article }: ArticleProps) => {
	const content = useArticle(front, article);
	return (
		<div>
			<Header backLink={urlBuilder(product, edition, front)}>
				{content ? content.title : 'loading'}
			</Header>
			{content ? (
				<div>
					<p>{content.content}</p>
					<ul>
						{[product, edition, front, article].map((thing, index) => (
							<li key={index}>{thing}</li>
						))}
					</ul>
				</div>
			) : (
				<div>loading</div>
			)}
		</div>
	);
};

export default Article;
