import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { SpecialEditionButton } from '../SpecialEditionButton'

jest.mock('src/components/front/image-resource', () => ({
    ImageResource: () => 'ImageResource',
}))

const fixtures = {
    expiry: new Date(98, 1),
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

export { fixtures }

describe('SpecialEditionButton', () => {
    it('should display a default SpecialEditionButton with imported styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <SpecialEditionButton {...fixtures} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a selected SpecialEditionButton despite imported styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <SpecialEditionButton selected {...fixtures} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
