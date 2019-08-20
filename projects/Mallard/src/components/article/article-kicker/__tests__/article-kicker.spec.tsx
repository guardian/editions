import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ArticleKicker } from '../normal-kicker'

describe('ArticleKicker', () => {
    it('should display a default Kicker', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleKicker kicker="Sport" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a long read style kicker', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleKicker kicker="Sport" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
