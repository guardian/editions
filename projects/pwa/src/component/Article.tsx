import React from 'react';
import useArticle from '../hooks/useArticle';
import { RouteComponentProps } from '@reach/router';

interface ArticleProps {
	edition: string;
	editionId: string;
	front: string;
	article: string;
}

const ArticleContent = ({
	edition,
	editionId,
	front,
	article,
}: ArticleProps) => {
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

const Article = (props: RouteComponentProps<ArticleProps>) => {
	if (props.front && props.article && props.edition && props.editionId) {
		return (
			<ArticleContent
				article={props.article}
				front={props.front}
				editionId={props.editionId}
				edition={props.edition}
			/>
		);
	} else return <div>Error</div>;
};

export default Article;
