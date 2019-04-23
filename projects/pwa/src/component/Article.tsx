import React from 'react';
import useArticle from '../hooks/useArticle';

export interface ArticleProps {
	product: string;
	edition: string;
	front: string;
	article: string;
}

const Article = ({ product, edition, front, article }: ArticleProps) => {
	const content = useArticle(front, article);
	return content ? (
		<div>
			<h2>{content.title}</h2>
			<p>{content.content}</p>
			<ul>
				{[product, edition, front, article].map((thing, index) => (
					<li key={index}>{thing}</li>
				))}
			</ul>
		</div>
	) : (
		<div>loading</div>
	);
};

export default Article;
