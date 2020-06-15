import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { EditionsMenuHeader } from '../Header'

describe('EditionsMenuHeader', () => {
    it('should display a default EditionsMenuHeader with correct styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <EditionsMenuHeader>Special Editions</EditionsMenuHeader>,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
