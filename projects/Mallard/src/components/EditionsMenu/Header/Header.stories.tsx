import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, color, text } from '@storybook/addon-knobs'
import { EditionsMenuHeader } from './Header'

storiesOf('EditionsMenuHeader', module)
    .addDecorator(withKnobs)
    .add('EditionsMenuHeader - default', () => (
        <EditionsMenuHeader>
            {text('Header Text', 'Regions')}
        </EditionsMenuHeader>
    ))
