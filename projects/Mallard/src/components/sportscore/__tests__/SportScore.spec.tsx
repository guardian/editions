import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { SportScore } from '../Sportscore'

const sportScore = 'Luton 3 - 0 Watford'

describe('SportScore', () => {
    it('should show a SportScore with default styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <SportScore sportScore={sportScore} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })

    it('should show a SportScore with rating styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <SportScore sportScore={sportScore} type="rating" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })

    it('should show a SportScore with stars styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <SportScore sportScore={sportScore} type="stars" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
