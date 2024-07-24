import React from 'react';
import type { CAPIArticle, IssueOrigin } from '../../common';
import { FlexErrorMessage } from '../../components/layout/ui/errors/flex-error-message';
import type { PathToArticle } from '../../paths';
import { color } from '../../theme/color';
import { ErrorBoundary } from '../layout/ui/errors/error-boundary';
import type { HeaderControlProps } from './types/article';
import { Article } from './types/article';
import { Crossword } from './types/crossword';

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

const ArticleController = ({
	article,
	path,
	origin,
	...headerControlProps
}: {
	article: CAPIArticle;
	path: PathToArticle;
	origin: IssueOrigin;
} & HeaderControlProps) => {
	if (article.type === 'crossword') {
		return <Crossword crosswordArticle={article} />;
	}

	return (
		<ErrorBoundary
			error={
				<FlexErrorMessage
					title={'Unable to render article'}
					style={{ backgroundColor: color.background }}
				/>
			}
		>
			<Article
				article={article}
				path={path}
				origin={origin}
				{...headerControlProps}
			/>
		</ErrorBoundary>
	);
};

export { ArticleController };
