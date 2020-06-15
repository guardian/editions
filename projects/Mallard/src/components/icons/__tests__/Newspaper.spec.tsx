import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Newspaper } from '../Newspaper'

describe('Newspaper', () => {
    it('should display a Newspaper icon in SVG', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <Newspaper />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
