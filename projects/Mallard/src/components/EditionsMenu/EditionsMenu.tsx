import React from 'react'
import { ScrollView } from 'react-native'
import { EditionsMenuHeader } from './Header/Header'
import { RegionButton } from './RegionButton/RegionButton'
import { SpecialEditionButton } from './SpecialEditionButton/SpecialEditionButton'

const props = {
    expiry: new Date(98, 1),
    devUri:
        'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
    image: {
        source: 'media',
        path: '/path/to/image',
    },
    onPress: () => {},
    title: `Food
Monthly`,
    subTitle: 'Store cupboard special: 20 quick and easy lockdown suppers',
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

const EditionsMenu = () => (
    <ScrollView>
        <EditionsMenuHeader>Regions</EditionsMenuHeader>
        <RegionButton
            onPress={() => {}}
            title="The Daily"
            subTitle="Published every day by 6am (GMT)"
        />
        <RegionButton
            onPress={() => {}}
            title="Australia Weekend"
            subTitle="Published every Saturday by 6am (AEST)"
        />
        <RegionButton
            onPress={() => {}}
            title="US Weekend"
            subTitle="Published every Saturday by 6am (EST)"
        />
        <EditionsMenuHeader>Special Editions</EditionsMenuHeader>
        <SpecialEditionButton {...props} />
    </ScrollView>
)

export { EditionsMenu }
