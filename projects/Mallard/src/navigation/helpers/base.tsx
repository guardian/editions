import type { StackNavigationProp } from '@react-navigation/stack';
import type { ReactElement } from 'react';
import type { ArticlePillar, CreditedImage, Issue } from '../../common';
import { logEvent } from '../../helpers/analytics';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import type { PathToArticle, PathToIssue } from '../../paths';
import type { ArticleNavigator } from '../../screens/article-screen';

export interface ArticleNavigationProps {
	path: PathToArticle;
	articleNavigator?: ArticleNavigator;
	/*
    some article types (crosswords) don't want a
    navigator or a card and would rather go fullscreen
    */
	prefersFullScreen?: boolean;
}

const getArticleNavigationProps = (
	routeParams: ArticleNavigationProps,
	{
		error,
		success,
	}: {
		error: () => ReactElement;
		success: (props: Required<ArticleNavigationProps>) => ReactElement;
	},
) => {
	const path = routeParams.path;
	const prefersFullScreen = routeParams.prefersFullScreen ?? false;
	const articleNavigator = routeParams.articleNavigator ?? [];

	if (
		!path ||
		!path.article ||
		!path.collection ||
		!path.localIssueId ||
		!path.publishedIssueId
	) {
		return error();
	} else {
		return success({
			path,
			articleNavigator,
			prefersFullScreen,
		});
	}
};

export interface IssueNavigationProps {
	path?: PathToIssue;
	issue?: Issue;
	initialFrontKey?: string | null;
}

interface NavigateToIssueProps {
	navigation: StackNavigationProp<MainStackParamList>;
	navigationProps: IssueNavigationProps;
	setIssueId: (path: PathToIssue, initialFrontKey?: string | null) => void;
}

const navigateToIssue = ({
	navigation,
	navigationProps,
	setIssueId,
}: NavigateToIssueProps) => {
	navigation.navigate(RouteNames.Issue, {
		...navigationProps,
	});
	if (navigationProps.path) {
		setIssueId(navigationProps.path, navigationProps.initialFrontKey);
	}
	logEvent({
		name: 'issues_list_issue',
		value: 'issues_list_issue_clicked',
	});
};

export interface LightboxNavigationProps {
	images?: CreditedImage[];
	imagePaths?: string[];
	index?: number;
	pillar?: ArticlePillar;
}

export { getArticleNavigationProps, navigateToIssue };
