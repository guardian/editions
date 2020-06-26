import { Button, ButtonAppearance } from 'src/components/Button/Button'
import { withNavigation } from 'react-navigation'
import { NavigationInjectedProps } from 'react-navigation'
import React from 'react'
import { Header } from 'src/components/layout/header/header'

export const BasicArticleHeader = withNavigation(
    ({ navigation }: NavigationInjectedProps) => (
        <Header
            theme="light"
            leftAction={
                <Button
                    appearance={ButtonAppearance.skeleton}
                    icon={'\uE00A'}
                    alt="Back"
                    onPress={() => navigation.goBack(null)}
                ></Button>
            }
            layout="center"
        >
            {null}
        </Header>
    ),
)
