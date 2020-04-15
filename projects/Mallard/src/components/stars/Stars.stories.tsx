import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, number } from '@storybook/addon-knobs'
import { Stars } from './Stars'

const rating = number('rating', 3)

storiesOf('Stars', module)
    .addDecorator(withKnobs)
    .add('Stars - default', () => <Stars rating={rating} />)
    .add('Stars - smallItems', () => (
        <Stars rating={rating} type="smallItems" />
    ))
    .add('Stars - trailImage', () => (
        <Stars rating={rating} type="trailImage" />
    ))
