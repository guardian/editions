import { useState, useEffect } from 'react';

type Article = {
	title: string;
	content: string;
};

type AsyncReturnable<Returnable> = Returnable | null;

const useArticle = (front: string, id: string): AsyncReturnable<Article> => {
	const [articleState, setState] = useState<AsyncReturnable<Article>>(null);
	useEffect(() => {
		setTimeout(() => {
			setState({
				title: `Article about ${id}`,
				content: `this is article ${id} in front ${front}`,
			});
		}, 200);
	}, [front, id]);

	return articleState;
};

export default useArticle;
