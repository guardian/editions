import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { SettingsButton } from '../SettingsButton'

describe('SettingsButton', () => {
    it('should display a SettingsButton', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <SettingsButton onPress={() => {}} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
