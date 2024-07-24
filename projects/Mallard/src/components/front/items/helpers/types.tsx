import { ArticleType } from '../../../../common';
import { useArticle } from '../../../../hooks/use-article';

export const useIsOpinionCard = () => {
	const [, { pillar, type }] = useArticle();
	return pillar === 'opinion' && type === ArticleType.Opinion;
};

export const useIsSportCard = () => {
	const [, { pillar }] = useArticle();
	return pillar === 'sport';
};
