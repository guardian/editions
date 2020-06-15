import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text } from '@storybook/addon-knobs'
import { RegionButton } from './RegionButton'

storiesOf('RegionButton', module)
    .addDecorator(withKnobs)
    .add('RegionButton - default', () => (
        <RegionButton
            onPress={() => {}}
            title={text('Title', 'Daily Edition')}
            subTitle={text('Subtitle', 'Published every day by 6am (GMT)')}
        />
    ))
    .add('RegionButton - selected', () => (
        <RegionButton
            selected
            onPress={() => {}}
            title={text('Title', 'Daily Edition')}
            subTitle={text('Subtitle', 'Published every day by 6am (GMT)')}
        />
    ))
