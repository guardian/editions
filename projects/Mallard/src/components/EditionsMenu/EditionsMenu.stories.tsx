import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs'
import { EditionsMenu } from './EditionsMenu'
import { editions, Edition } from 'src/common'
import { SpecialEdition } from '../../../../Apps/common/src'

const props: { specialEditions: SpecialEdition[] } = {
    specialEditions: [
        {
            edition: 'daily-edition' as Edition,
            expiry: new Date(98, 1),
            buttonImageUri:
                'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
            topic: 'food',
            editionType: 'Special',
            notificationUTCOffset: 0,
            header: {
                title: `Food
Monthly`,
            },
            title: `Food
Monthly`,
            subTitle:
                'Store cupboard special: 20 quick and easy lockdown suppers',
            buttonStyle: {
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
        },
    ],
}

storiesOf('EditionsMenu', module)
    .addDecorator(withKnobs)
    .add('EditionsMenu - default', () => (
        <EditionsMenu
            navigationPress={() => {}}
            selectedEdition={editions.daily}
            storeSelectedEdition={() => {}}
        />
    ))
    .add('EditionsMenu - with Special Edition', () => (
        <EditionsMenu
            navigationPress={() => {}}
            selectedEdition={editions.daily}
            storeSelectedEdition={() => {}}
            {...props}
        />
    ))
