import React from 'react'
import { storiesOf } from '@storybook/react-native'
import CenterView from './CenterView'
import { Spinner } from '../../src/components/spinner'

storiesOf('Spinner', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Standard Spinner', () => <Spinner />)
