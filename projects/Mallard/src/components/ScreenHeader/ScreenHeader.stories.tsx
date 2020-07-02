import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { ScreenHeader } from './ScreenHeader'
import { props } from './fixtures'

storiesOf('ScreenHeader', module)
    .add('Default', () => <ScreenHeader />)
    .add('with Title', () => <ScreenHeader title={props.title} />)
    .add('with Title and Subtitle', () => (
        <ScreenHeader title={props.title} subTitle={props.subTitle} />
    ))
    .add('with Title, Subtitle and Right Action', () => (
        <ScreenHeader
            title={props.title}
            subTitle={props.subTitle}
            rightAction={props.rightAction}
        />
    ))
    .add('with Title, Subtitle, Right Action and Left Action', () => (
        <ScreenHeader
            title={props.title}
            subTitle={props.subTitle}
            rightAction={props.rightAction}
            leftAction={props.leftAction}
        />
    ))
    .add(
        'with Title, Subtitle, Right Action, Left Action and Title is Pressable',
        () => (
            <ScreenHeader
                title={props.title}
                subTitle={props.subTitle}
                rightAction={props.rightAction}
                leftAction={props.leftAction}
                onPress={props.onPress}
            />
        ),
    )
    .add(
        'with Title, Subtitle, Right Action, Left Action, Title is Pressable and Custom Header Styles',
        () => <ScreenHeader {...props} />,
    )
