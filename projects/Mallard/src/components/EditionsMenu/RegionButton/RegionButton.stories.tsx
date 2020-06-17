import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs'
import { RegionButton } from './RegionButton'

storiesOf('RegionButton', module)
    .addDecorator(withKnobs)
    .add('RegionButton - default', () => (
        <RegionButton
            onPress={() => {}}
            title="Daily Edition"
            subTitle={'Published every day by 6am (GMT)'}
        />
    ))
    .add('RegionButton - selected', () => (
        <RegionButton
            selected
            onPress={() => {}}
            title={'Daily Edition'}
            subTitle={'Published every day by 6am (GMT)'}
        />
    ))
