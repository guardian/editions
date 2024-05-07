import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ArticlePillar } from '../../common';
import { ArticleType } from '../../common';
import { ArticleController } from '../../components/article';
import type { HeaderControlInnerProps } from '../../components/article/types/article';
import { FlexErrorMessage } from '../../components/layout/ui/errors/flex-error-message';
import { UiBodyCopy } from '../../components/styled-text';
import {
	getCollectionPillarOverride,
	WithArticle,
} from '../../hooks/use-article';
import { useApiUrl } from '../../hooks/use-config-provider';
import { useIssue } from '../../hooks/use-issue-provider';
import type { PathToArticle } from '../../paths';
import { color } from '../../theme/color';

const styles = StyleSheet.create({
	flex: { flexGrow: 1 },
	container: { height: '100%' },
});

export type OnIsAtTopChange = (isAtTop: boolean, articleKey: string) => void;

const ArticleScreenBody = React.memo<
	{
		path: PathToArticle;
		pillar: ArticlePillar;
		width: number;
		position?: number;
		onIsAtTopChange?: OnIsAtTopChange;
	} & HeaderControlInnerProps
>(
	({
		path,
		pillar,
		width,
		position,
		onIsAtTopChange,
		...headerControlProps
	}) => {
		const { getArticle, error, retry } = useIssue();
		const article = getArticle(path);
		const { isPreview } = useApiUrl();
		const previewNotice = isPreview
			? `${path.collection}:${position}`
			: undefined;

		const handleIsAtTopChange = useCallback(
			(value: boolean) => onIsAtTopChange?.(value, path.article),
			[onIsAtTopChange],
		);

		// First time it's mounted, we make sure to report we're at the top.
		useEffect(() => handleIsAtTopChange(true), []);
		return (
			<View style={[styles.container, { width }]}>
				{article ? (
					<>
						{previewNotice && (
							<UiBodyCopy>{previewNotice}</UiBodyCopy>
						)}

						<WithArticle
							type={
								article.article.articleType ??
								ArticleType.Article
							}
							pillar={getCollectionPillarOverride(
								pillar,
								path.collection,
							)}
						>
							<ArticleController
								{...headerControlProps}
								path={path}
								article={article.article}
								onIsAtTopChange={handleIsAtTopChange}
								origin={article.origin}
							/>
						</WithArticle>
					</>
				) : error ? (
					<FlexErrorMessage
						title={error}
						style={{ backgroundColor: color.background }}
						action={['Retry', retry]}
					/>
				) : (
					<FlexErrorMessage
						title={'loading'}
						style={{ backgroundColor: color.background }}
					/>
				)}
			</View>
		);
	},
);

export { ArticleScreenBody };
