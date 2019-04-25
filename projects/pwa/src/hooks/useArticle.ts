import { useState, useEffect } from 'react';

// TODO: replace with call to backend!
import { data as articleData } from '../fixtures/article';

type Article = {
	headline: string;
	body: string;
};

type AsyncReturnable<Returnable> = Returnable | null;

const useArticle = (front: string, id: string): AsyncReturnable<Article> => {
	const [articleState, setState] = useState<AsyncReturnable<Article>>(null);
	useEffect(() => {
		setTimeout(() => {
			setState({
				headline: articleData.page.content.headline,
				body: articleData.page.content.body,
			});
		}, 200);
	}, [front, id]);

	return articleState;
};

export default useArticle;
