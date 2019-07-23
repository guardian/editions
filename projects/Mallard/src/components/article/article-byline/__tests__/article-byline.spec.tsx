import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ArticleByline } from '..'

describe('ArticleByline', () => {
    it('should display a default Byline', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ArticleByline>Gary Younge</ArticleByline>,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
