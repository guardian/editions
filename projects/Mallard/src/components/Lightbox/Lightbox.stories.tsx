import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text, color } from '@storybook/addon-knobs'
import { LightboxCaption } from './LightboxCaption'
import { LightboxImage } from './LightboxImage'

const caption = text('caption', 'Some people jumping for joy')
const pillarColor = color('pillar', '#FF0000')
const image = {
    path:
        'daily-edition/2020-04-16/2020-04-16T00:52:50.881Z/media/tablet/media/02e9fb24dbd5a864953ffaf7c0525c778c9f1aad/0_159_2968_1782/master/2968.jpg',
    source: 'media',
}

storiesOf('Lightbox', module)
    .addDecorator(withKnobs)
    .add('LightboxCaption - default', () => (
        <LightboxCaption caption={caption} pillarColor={pillarColor} />
    ))
    .add('LightboxImage - default', () => <LightboxImage image={image} />)
