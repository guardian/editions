import { color, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { IssueOrigin } from '../../../../../Apps/common/src'
import { IssuePickerHeader } from './IssuePickerHeader'

const issue = {
    name: 'Daily Edition',
    date: '2020-06-25',
    key: 'daily-edition/2020-06-25',
    publishedId: 'daily-edition/2020-06-25/2020-06-25T00:58:19.4Z',
    localId: 'daily-edition/2020-06-25',
    fronts: [],
    origin: 'api' as IssueOrigin,
}

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
