import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { BugButton } from '../BugButton'

describe('BugButton', () => {
    it('should display a BugButton', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <BugButton onPress={() => {}} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
