import React from 'react';
import useArticle from '../hooks/useArticle';

interface ArticleProps {
	edition: string;
	editionId: string;
	front: string;
	article: string;
}

const Article = ({
	edition,
	editionId,
	front,
	article,
}: ArticleProps & any) => {
	const content = useArticle(front, article);
	return content ? (
		<div>
			<h2>{content.title}</h2>
			<p>{content.content}</p>
			<ul>
				{[edition, editionId, front, article].map(_ => (
					<li>{_}</li>
				))}
			</ul>
		</div>
	) : (
		<div>loading</div>
	);
};

export default Article;
