import type { ReactElement } from 'react';
import type { CompositeNavigationStackProps } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import type { PathToArticle, PathToIssue } from 'src/paths';
import type { ArticleNavigator } from 'src/screens/article-screen';
import { Action, ComponentType, sendComponentEvent } from 'src/services/ophan';
import type {
	ArticlePillar,
	CreditedImage,
	Issue,
} from '../../../../Apps/common/src';

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
	navigation: CompositeNavigationStackProps;
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
	sendComponentEvent({
		componentType: ComponentType.AppButton,
		action: Action.Click,
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
