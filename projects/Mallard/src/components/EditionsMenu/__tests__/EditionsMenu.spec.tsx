import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Edition, editions } from 'src/common'
import { EditionsMenu } from '../EditionsMenu'

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

const regionalEditions = [
    {
        title: 'The UK Daily Edition',
        subTitle: 'Published every day by 12am (GMT)',
        edition: editions.daily as Edition,
        header: {
            title: 'The Daily',
        },
    },
    {
        title: 'Australia Daily',
        subTitle: 'Published every day by 9:30am (AEST)',
        edition: editions.ausWeekly as Edition,
        header: {
            title: 'Austraila',
            subTitle: 'Weekender',
        },
    },
    {
        title: 'US and Cananda Weekend',
        subTitle: 'Published every Saturday by 8am (EST)',
        edition: editions.usWeekly as Edition,
        header: {
            title: 'US',
            subTitle: 'Weekender',
        },
    },
]

const specialEditions = [
    {
        edition: 'daily-edition' as Edition,
        expiry: new Date(98, 1),
        image: {
            source: 'media',
            path: '/path/to/image',
        },
        title: `Food
Monthly`,
        subTitle: 'Store cupboard special: 20 quick and easy lockdown suppers',
        header: {
            title: 'Food',
            subTitle: 'Monthly',
        },
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
