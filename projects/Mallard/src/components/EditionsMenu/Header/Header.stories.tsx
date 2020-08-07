import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text } from '@storybook/addon-knobs'
import { EditionsMenuHeader } from './Header'

storiesOf('EditionsMenu', module)
    .addDecorator(withKnobs)
    .add('EditionsMenuHeader - default', () => (
        <EditionsMenuHeader>
            {text('Header Text', 'Regions')}
        </EditionsMenuHeader>
    ))
