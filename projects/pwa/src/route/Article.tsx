import React from 'react';
import useArticle from '../hooks/useArticle';
import Header from '../component/Header';
import { urlBuilder } from '../helper/urlBuilder';
import Content from '../component/Content';

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
			<Header
				backLink={{
					title: `${front} front`,
					url: urlBuilder(product, edition, front),
				}}
			>
				{content ? content.title : 'loading'}
			</Header>
			<Content>
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
			</Content>
		</div>
	);
};

export default Article;
