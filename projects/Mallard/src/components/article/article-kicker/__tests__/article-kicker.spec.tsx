import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ArticleKicker } from '../article-kicker'

describe('ArticleKicker', () => {
    it('should display a default Kicker', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleKicker kicker="Sport" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a long read style kicker', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleKicker kicker="Sport" type="longRead" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should return null if the kicker is "Opinion"', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleKicker kicker="Opinion" />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
