import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs'
import { EditionsMenuButton } from './EditionsMenuButton'

storiesOf('EditionsMenu', module)
    .addDecorator(withKnobs)
    .add('EditionsMenuButton - default', () => (
        <EditionsMenuButton onPress={() => {}} />
    ))
    .add('EditionsMenuButton - selected', () => (
        <EditionsMenuButton onPress={() => {}} selected />
    ))
