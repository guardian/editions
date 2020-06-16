import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text } from '@storybook/addon-knobs'
import { SpecialEditionButton } from './SpecialEditionButton'

const props = {
    devUri:
        'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
    expiry: new Date(),
    image: {
        source: '',
        path: '',
    },
    onPress: () => {},
    title: text(
        'Title',
        `Food
Monthly`,
    ),
    subTitle: text(
        'SubTitle',
        'Store cupboard special: 20 quick and easy lockdown suppers',
    ),
    style: {
        backgroundColor: '#FEEEF7',
        expiry: {
            color: '#7D0068',
            font: 'GuardianTextSans-Regular',
            lineHeight: 16,
            size: 15,
        },

        subTitle: {
            color: '#7D0068',
            font: 'GuardianTextSans-Bold',
            lineHeight: 20,
            size: 17,
        },
        title: {
            color: '#121212',
            font: 'GHGuardianHeadline-Regular',
            lineHeight: 34,
            size: 34,
        },
        image: {
            height: 134,
            width: 87,
        },
    },
}

storiesOf('SpecialEditionButton', module)
    .addDecorator(withKnobs)
    // This is useful to check the default style but breaks TS
    // .add('SpecialEditionButton - default', () => (
    //     <SpecialEditionButton {...props} style={null} />
    // ))
    .add('SpecialEditionButton - with styles', () => (
        <SpecialEditionButton {...props} />
    ))
    .add('SpecialEditionButton - selected', () => (
        <SpecialEditionButton selected {...props} />
    ))
