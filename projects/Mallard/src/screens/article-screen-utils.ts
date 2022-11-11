import type { PathToArticle } from 'src/paths';
import type { Appearance } from '../../../Apps/common/src';
import type { ArticleNavigator } from './article-screen';

type ArticleSpec = PathToArticle & {
	frontName: string;
	appearance: Appearance;
};

export const getArticleDataFromNavigator = (
	navigator: ArticleNavigator,
	currentArticle: PathToArticle,
): {
	startingPoint: number;
	appearance: Appearance;
	frontName: string;
	flattenedArticles: ArticleSpec[];
} => {
	const flattenedArticles: ArticleSpec[] = [];
	navigator.forEach((frontSpec) =>
		frontSpec.articleSpecs.forEach((as) =>
			flattenedArticles.push({
				...as,
				appearance: frontSpec.appearance,
				frontName: frontSpec.frontName,
			}),
		),
	);

	const startingPoint = flattenedArticles.findIndex(
		({ article, front }) =>
			currentArticle.article === article &&
			currentArticle.front === front,
	);
	if (startingPoint < 0) {
		return {
			startingPoint: 0,
			appearance: { type: 'pillar', name: 'neutral' } as const,
			frontName: '',
			flattenedArticles: [
				{
					...currentArticle,
					appearance: { type: 'pillar', name: 'neutral' } as const,
					frontName: '',
				},
				...flattenedArticles,
			],
		};
	}
	return {
		startingPoint,
		appearance: flattenedArticles[startingPoint].appearance,
		frontName: flattenedArticles[startingPoint].frontName,
		flattenedArticles,
	};
};
