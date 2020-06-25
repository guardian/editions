import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Edition, editions } from '../../../../../Apps/common/src'
import { EditionsMenu } from '../EditionsMenu'

jest.mock('src/components/front/image-resource', () => ({
    ImageResource: () => 'ImageResource',
}))

jest.mock('@apollo/react-hooks', () => ({
    useApolloClient: () => jest.fn(),
    useQuery: () => ({ data: 'something' }),
}))

const mockNavigation = {
    state: { params: {} },
    dispatch: jest.fn(),
    goBack: jest.fn(),
    dismiss: jest.fn(),
    navigate: jest.fn(),
    openDrawer: jest.fn(),
    closeDrawer: jest.fn(),
    toggleDrawer: jest.fn(),
    getParam: jest.fn(),
    setParams: jest.fn(),
    addListener: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    isFocused: jest.fn(),
    reset: jest.fn(),
    isFirstRouteInParent: jest.fn(),
    dangerouslyGetParent: jest.fn(),
}

const regionalEditions = [
    {
        title: 'The UK Daily Edition',
        subTitle: 'Published every day by 12am (GMT)',
        edition: editions.daily as Edition,
    },
    {
        title: 'Australia Daily',
        subTitle: 'Published every day by 9:30am (AEST)',
        edition: editions.ausWeekly as Edition,
    },
    {
        title: 'US and Cananda Weekend',
        subTitle: 'Published every Saturday by 8am (EST)',
        edition: editions.usWeekly as Edition,
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
            <EditionsMenu navigation={mockNavigation} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a EditionsMenu with correct styling and alternative Regional Buttons', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu
                navigation={mockNavigation}
                regionalEdtions={regionalEditions}
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a EditionsMenu with correct styling default Regional Buttons and a Special Edition Button', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu
                navigation={mockNavigation}
                specialEditions={specialEditions}
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
