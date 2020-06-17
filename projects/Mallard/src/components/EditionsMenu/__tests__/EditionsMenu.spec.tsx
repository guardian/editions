import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { EditionsMenu } from '../EditionsMenu'

jest.mock('src/components/front/image-resource', () => ({
    ImageResource: () => 'ImageResource',
}))

jest.mock('src/helpers/locale', () => ({
    locale: 'en_GB',
}))

describe('EditionsMenu', () => {
    it('should display a default EditionsMenu with correct styling and default Regional Buttons', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenu />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    // Needs Regional Editions with different titles
    // Needs Special Editions
})
