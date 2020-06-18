import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { RightChevron } from '../RightChevron'

describe('RightChevron', () => {
    it('should display a RightChevron icon using the icon font', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <RightChevron />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
