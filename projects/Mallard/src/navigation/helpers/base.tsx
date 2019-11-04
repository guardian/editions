import React, { ReactElement } from 'react'
import {
    NavigationContainer,
    NavigationInjectedProps,
    NavigationScreenProp,
} from 'react-navigation'
import { routeNames } from 'src/navigation/routes'
import { PathToArticle, PathToIssue } from 'src/paths'
import { ArticleNavigator } from 'src/screens/article-screen'
import { Issue } from '../../../../common/src'
import { Action, ComponentType, sendComponentEvent } from 'src/services/ophan'

type NavigatorWrapper = ({ navigation }: NavigationInjectedProps) => JSX.Element
export const addStaticRouter = (
    navigator: NavigationContainer,
    wrapper: NavigatorWrapper,
): NavigationContainer => {
    const wrapperWithRouter = wrapper as NavigatorWrapper & NavigationContainer
    wrapperWithRouter.router = navigator.router

    return wrapperWithRouter as NavigationContainer
}

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
)

export interface ArticleNavigationProps {
    path: PathToArticle
    articleNavigator?: ArticleNavigator
    /*
    some article types (crosswords) don't want a
    navigator or a card and would rather go fullscreen
    */
    prefersFullScreen?: boolean
}

const navigateToArticle = (
    navigation: NavigationScreenProp<{}>,
    navigationProps: ArticleNavigationProps,
): void => {
    navigation.navigate(routeNames.Article, navigationProps)
}
const getArticleNavigationProps = (
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>,
    {
        error,
        success,
    }: {
        error: () => ReactElement
        success: (props: Required<ArticleNavigationProps>) => ReactElement
    },
) => {
    const path = navigation.getParam('path')
    const prefersFullScreen = navigation.getParam('prefersFullScreen', false)
    const articleNavigator = navigation.getParam('articleNavigator', [])

    if (
        !path ||
        !path.article ||
        !path.collection ||
        !path.localIssueId ||
        !path.publishedIssueId
    ) {
        return error()
    } else {
        return success({
            path,
            articleNavigator,
            prefersFullScreen,
        })
    }
}

const navigateToIssueList = (navigation: NavigationScreenProp<{}>): void => {
    navigation.navigate(routeNames.IssueList, { from: navigation.state.params })
}

export interface IssueNavigationProps {
    path?: PathToIssue
    issue?: Issue
}

interface NavigateToIssueProps {
    navigation: NavigationScreenProp<{}>
    navigationProps: IssueNavigationProps
    setIssueId: (path: PathToIssue) => void
}

const navigateToIssue = ({
    navigation,
    navigationProps,
    setIssueId,
}: NavigateToIssueProps) => {
    navigation.navigate(routeNames.Issue, {
        ...navigationProps,
    })
    if (navigationProps.path) {
        setIssueId(navigationProps.path)
    }
    sendComponentEvent({
        componentType: ComponentType.appButton,
        action: Action.click,
        value: 'issues_list_issue_clicked',
    })
}

const navigateToSettings = (navigation: NavigationScreenProp<{}>): void => {
    navigation.navigate(routeNames.Settings)
}

export {
    mapNavigationToProps,
    navigateToArticle,
    navigateToIssueList,
    getArticleNavigationProps,
    navigateToIssue,
    navigateToSettings,
}
