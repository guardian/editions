import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text } from '@storybook/addon-knobs'
import { EditionsMenu } from './EditionsMenu'

storiesOf('EditionsMenu', module)
    .addDecorator(withKnobs)
    .add('EditionsMenu - default', () => <EditionsMenu />)
