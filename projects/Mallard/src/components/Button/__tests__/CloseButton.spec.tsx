import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { CloseButton } from '../CloseButton'
import { ButtonAppearance } from '../Button'

describe('CloseButton', () => {
    it('should display a default CloseButton', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <CloseButton
                onPress={() => {}}
                accessibilityHint="Accessibility Hint"
                accessibilityLabel="Accessibility Label"
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a CloseButton with an alternative appearance', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <CloseButton
                onPress={() => {}}
                accessibilityHint="Accessibility Hint"
                accessibilityLabel="Accessibility Label"
                appearance={ButtonAppearance.modal}
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
