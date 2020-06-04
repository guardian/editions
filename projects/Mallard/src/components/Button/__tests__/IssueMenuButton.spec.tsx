import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { IssueMenuButton } from '../IssueMenuButton'

describe('IssueMenuButton', () => {
    it('should display a IssueMenuButton', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <IssueMenuButton onPress={() => {}} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
