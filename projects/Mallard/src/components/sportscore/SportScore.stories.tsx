import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text } from '@storybook/addon-knobs'
import { SportScore } from './sportscore'

const sportScore = text('sportScore', 'Luton 3 - Watford 0')

storiesOf('SportScore', module)
    .addDecorator(withKnobs)
    .add('SportScore - default', () => <SportScore sportScore={sportScore} />)
    .add('SportScore - rating', () => (
        <SportScore sportScore={sportScore} type="rating" />
    ))
    .add('SportScore - stars', () => (
        <SportScore sportScore={sportScore} type="stars" />
    ))
