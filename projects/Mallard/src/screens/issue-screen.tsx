import React, { useState, useEffect } from 'react'
import {
    NavigationScreenProp,
    NavigationEvents,
    FlatList,
    NavigationInjectedProps,
} from 'react-navigation'

import { Front } from 'src/components/front'
import { Issue } from 'src/common'
import { IssueHeader, HeaderProps } from 'src/components/layout/header/header'

import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { FlexCenter } from 'src/components/layout/flex-center'
import { useIssueOrLatestResponse } from 'src/hooks/use-issue'
import { Spinner } from 'src/components/spinner'

import { withNavigation } from 'react-navigation'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { navigateToIssueList } from 'src/navigation/helpers'
import { Container } from 'src/components/layout/ui/container'
import { Weather } from 'src/components/weather'
import { usePrevious } from 'src/hooks/use-previous'

export interface PathToIssue {
    issue: Issue['key']
}

const Header = withNavigation(
    ({
        issue,
        onLayout,
        navigation,
    }: {
        issue?: Issue
        onLayout?: HeaderProps['onLayout']
    } & NavigationInjectedProps) => {
        return (
            <IssueHeader
                accessibilityHint="More issues"
                onLayout={onLayout}
                onPress={() => {
                    navigateToIssueList(navigation)
                }}
                action={
                    <Button
                        icon=""
                        alt="More issues"
                        onPress={() => {
                            navigateToIssueList(navigation)
                        }}
                    />
                }
                issue={issue}
            />
        )
    },
)

const IssueScreenWithPath = ({
    path,
    isActive,
}: {
    path: PathToIssue | undefined
    isActive: boolean
}) => {
    /*
    we don't wanna render a massive tree at once
    as the navigator is trying to push the screen bc this
    delays the tap response

    we can pass this prop to identify if we wanna render
    just the 'above the fold' content or the whole shebang
    */
    const response = useIssueOrLatestResponse(path && path.issue)
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)

    const [[prev, curr], setHeaderHeight] = usePrevious<number | null>(null)
    console.log({ isActive, prev })
    return (
        <Container
            translateY={isActive || !curr ? 0 : -curr}
            transitionDuration={prev === null ? 0 : 200}
        >
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {response({
                error: ({ message }, { retry }) => (
                    <>
                        <Header
                            onLayout={e =>
                                setHeaderHeight(e.nativeEvent.layout.height)
                            }
                        />

                        <FlexErrorMessage
                            debugMessage={message}
                            action={['Retry', retry]}
                        />
                    </>
                ),
                pending: () => (
                    <>
                        <Header
                            onLayout={e =>
                                setHeaderHeight(e.nativeEvent.layout.height)
                            }
                        />
                        <FlexCenter>
                            <Spinner />
                        </FlexCenter>
                    </>
                ),
                success: issue => (
                    <>
                        <Header
                            issue={issue}
                            onLayout={e =>
                                setHeaderHeight(e.nativeEvent.layout.height)
                            }
                        />
                        <FlatList
                            data={issue.fronts}
                            windowSize={3}
                            maxToRenderPerBatch={2}
                            initialNumToRender={1}
                            ListHeaderComponent={<Weather />}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <Front
                                    issue={issue.key}
                                    front={item}
                                    {...{ viewIsTransitioning }}
                                />
                            )}
                        />
                    </>
                ),
            })}
        </Container>
    )
}

export const IssueScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const path = navigation.getParam('path') as PathToIssue | undefined
    const [isActive, setIsActive] = useState(navigation.isFocused())
    console.log('rerender', isActive, navigation)
    useEffect(() => {
        const blurSub = navigation.addListener('willBlur', () => {
            console.log('willBlur')
            setIsActive(false)
        })
        const focusSub = navigation.addListener('willFocus', () => {
            console.log('willFocus')
            setIsActive(true)
        })
        return () => {
            blurSub.remove()
            focusSub.remove()
            console.log('unmount')
        }
    }, [])
    return (
        <IssueScreenWithPath
            isActive={isActive}
            path={path && path.issue ? path : undefined}
        />
    )
}
