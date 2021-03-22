import type { StackNavigationProp } from '@react-navigation/stack';
import type { ReactElement } from 'react';
import React from 'react';
import type {
	NavigationContainer,
	NavigationInjectedProps,
	NavigationScreenProp,
} from 'react-navigation';
import type { RootStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import type { PathToArticle, PathToIssue } from 'src/paths';
import type { ArticleNavigator } from 'src/screens/article-screen';
import { Action, ComponentType, sendComponentEvent } from 'src/services/ophan';
import type {
	ArticlePillar,
	CreditedImage,
	Issue,
} from '../../../../Apps/common/src';

type NavigatorWrapper = ({
	navigation,
}: NavigationInjectedProps) => JSX.Element;
export const addStaticRouter = (
	navigator: NavigationContainer,
	wrapper: NavigatorWrapper,
): NavigationContainer => {
	const wrapperWithRouter = wrapper as NavigatorWrapper & NavigationContainer;
	wrapperWithRouter.router = navigator.router;

	return wrapperWithRouter as NavigationContainer;
};

/**
 *
 * @param Component - component that doesn't want to have navigation as a dependency
 * @param mapper - function to generate props from navigation
 *
 * Much like `mapDispatchToProps` in `redux`. Means we can decouple out components from navigation.
 */
const mapNavigationToProps = <T extends {}, P extends {}>(
	Component: React.ComponentType<T>,
	mapper: (navigation: NavigationScreenProp<P>) => Partial<T>,
) => (props: T & { navigation: NavigationScreenProp<P> }) => (
	<Component {...props} {...mapper(props.navigation)} />
);

export interface ArticleNavigationProps {
	path: PathToArticle;
	articleNavigator?: ArticleNavigator;
	/*
    some article types (crosswords) don't want a
    navigator or a card and would rather go fullscreen
    */
	prefersFullScreen?: boolean;
}

const navigateToArticle = (
	navigation: StackNavigationProp<RootStackParamList>,
	navigationProps: ArticleNavigationProps,
): void => {
	navigation.navigate(RouteNames.Article, navigationProps);
};

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
	navigation: NavigationScreenProp<{}>;
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

interface LightboxProps {
	navigation: NavigationScreenProp<{}>;
	navigationProps: LightboxNavigationProps;
}

const navigateToLightbox = ({ navigation, navigationProps }: LightboxProps) => {
	navigation.navigate(RouteNames.Lightbox, {
		...navigationProps,
	});
};

export {
	mapNavigationToProps,
	navigateToArticle,
	getArticleNavigationProps,
	navigateToIssue,
	navigateToLightbox,
};
