import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs'
import { NewEditionCard } from './new-edition'

storiesOf('NewEdiition', module)
    .addDecorator(withKnobs)
    .add('SportScore - default', () => (
        <NewEditionCard
            title={'New Special Edition!'}
            subtitle={'Gal-Dem Takover'}
        />
    ))
    .add('SportScore - title2', () => (
        <NewEditionCard title={'New Special Edition!'} />
    ))
