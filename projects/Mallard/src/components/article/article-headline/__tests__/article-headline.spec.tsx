import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ArticleHeadline } from '..'

describe('ArticleHeadline', () => {
    it('should show a news headling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleHeadline type="news">
                England’s Suzy Petty hopes to help GB hockey team make it to
                Olympics
            </ArticleHeadline>,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should show a long read headling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleHeadline type="longRead">
                England’s Suzy Petty hopes to help GB hockey team make it to
                Olympics
            </ArticleHeadline>,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
