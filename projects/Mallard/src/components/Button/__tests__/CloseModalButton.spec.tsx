import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { CloseModalButton } from '../CloseModalButton'

describe('CloseModalButton', () => {
    it('should display a CloseModalButton', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <CloseModalButton onPress={() => {}} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a CloseModalButton with a colour prop', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <CloseModalButton
                onPress={() => {}}
                bgColor="#41A9E0"
                borderColor="#41A9E0"
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
