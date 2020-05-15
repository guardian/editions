import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ReloadButton } from '../ReloadButton'

describe('ReloadButton', () => {
    it('should display a ReloadButton', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ReloadButton onPress={() => {}} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
