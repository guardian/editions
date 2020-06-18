import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { EditionsMenu } from '../EditionsMenu'
import { editions } from 'src/helpers/settings/defaults'

jest.mock('src/components/front/image-resource', () => ({
    ImageResource: () => 'ImageResource',
}))

jest.mock('src/helpers/locale', () => ({
    locale: 'en_GB',
}))

const regionalEditions = [
    {
        title: 'The UK Daily Edition',
        subTitle: 'Published every day by 12am (GMT)',
        edition: editions.daily,
    },
    {
        title: 'Australia Daily',
        subTitle: 'Published every day by 9:30am (AEST)',
        edition: editions.ausWeekly,
    },
    {
        title: 'US and Cananda Weekend',
        subTitle: 'Published every Saturday by 8am (EST)',
        edition: editions.usWeekly,
    },
]

const specialEditions = [
    {
        edition: '',
        expiry: new Date(98, 1),
        image: {
            source: 'media',
            path: '/path/to/image',
        },
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
    },
]

describe('EditionsMenu', () => {
    it('should display a default EditionsMenu with correct styling and default Regional Buttons', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a EditionsMenu with correct styling and alternative Regional Buttons', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu regionalEdtions={regionalEditions} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a EditionsMenu with correct styling default Regional Buttons and a Special Edition Button', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu specialEditions={specialEditions} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
