import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Quote } from '../Quote'

describe('Quote', () => {
    it('should display a Quote icon in SVG', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <Quote />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
