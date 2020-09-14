import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Edition, editions } from 'src/common'
import { EditionsMenu } from '../EditionsMenu'
import { RegionalEdition, SpecialEdition } from '../../../../../Apps/common/src'

jest.mock('src/components/EditionsMenu/RegionButton/RegionButton', () => ({
    RegionButton: () => 'RegionButton',
}))

jest.mock(
    'src/components/EditionsMenu/SpecialEditionButton/SpecialEditionButton',
    () => ({
        SpecialEditionButton: () => 'SpecialEditionButton',
    }),
)

jest.mock('src/components/EditionsMenu/Header/Header', () => ({
    EditionsMenuHeader: () => 'EditionsMenuHeader',
}))

const regionalEditions: RegionalEdition[] = [
    {
        title: 'UK Daily',
        subTitle: 'Published every day by 12am (GMT)',
        edition: editions.daily as Edition,
        header: {
            title: 'UK Daily',
            subTitle: 'Daily',
        },
        editionType: 'Regional',
        topic: 'au',
        notificationUTCOffset: 1,
        locale: 'en_GB',
    },
    {
        title: 'Australia Daily',
        subTitle: 'Published every day by 9:30am (AEST)',
        edition: editions.ausWeekly as Edition,
        header: {
            title: 'Austraila',
            subTitle: 'Weekend',
        },
        editionType: 'Regional',
        topic: 'au',
        notificationUTCOffset: 1,
        locale: 'en_AU',
    },
]

const specialEditions: SpecialEdition[] = [
    {
        edition: 'daily-edition' as Edition,
        expiry: new Date(98, 1),
        editionType: 'Special',
        notificationUTCOffset: 1,
        topic: 'food',
        title: `Food
Monthly`,
        subTitle: 'Store cupboard special: 20 quick and easy lockdown suppers',
        header: {
            title: 'Food',
            subTitle: 'Monthly',
        },
        buttonImageUri:
            'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
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
]

const props = {
    navigationPress: () => {},
    selectedEdition: editions.daily,
    storeSelectedEdition: () => {},
}

describe('EditionsMenu', () => {
    it('should display a default EditionsMenu with correct styling and default Regional Buttons', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu {...props} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a EditionsMenu with correct styling and alternative Regional Buttons', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu {...props} regionalEditions={regionalEditions} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a EditionsMenu with correct styling default Regional Buttons and a Special Edition Button', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu {...props} specialEditions={specialEditions} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
