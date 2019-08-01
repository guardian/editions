import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ArticleMultiline } from '..'

describe('ArticleMultiline', () => {
    it('should display a consistent Multiline for Article Headers', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleMultiline />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
