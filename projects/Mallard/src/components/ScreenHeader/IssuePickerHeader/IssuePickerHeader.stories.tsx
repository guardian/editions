import { color, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { IssuePickerHeader } from './IssuePickerHeader'

storiesOf('IssuePickerHeader', module)
    .addDecorator(withKnobs)
    .add('Default', () => <IssuePickerHeader />)
    .add('With Header Styles', () => (
        <IssuePickerHeader
            headerStyles={{
                backgroundColor: color('Background Colour', '#7D0068'),
                textColorPrimary: color('Text Colour Primary', '#007ABC'),
                textColorSecondary: color('Text Colour Secondary', '#F3C100'),
            }}
        />
    ))
