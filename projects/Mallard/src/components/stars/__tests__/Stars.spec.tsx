import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { Stars } from '../stars'

const rating = 5

describe('Stars', () => {
    it('should show a Stars with default styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <Stars rating={rating} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })

    it('should show a Stars with trailImage styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <Stars rating={rating} type="trailImage" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })

    it('should show a Stars with smallItems styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <Stars rating={rating} type="smallItems" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
