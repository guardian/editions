import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ArticleStandfirst } from '../article-standfirst'

describe('ArticleStandfirst', () => {
    it('should display a default Standfirst', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleStandfirst
                standfirst="This is a test Standfirst"
                byline="Byline McJournalist"
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should be able to asborb an injected style', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleStandfirst
                standfirst="This is a test Standfirst"
                byline="Byline McJournalist"
                style={{ backgroundColor: 'black' }}
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
