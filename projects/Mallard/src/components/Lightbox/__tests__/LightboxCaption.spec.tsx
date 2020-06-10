import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { LightboxCaption } from '../LightboxCaption'

jest.mock('@react-native-firebase/remote-config', () => {
    remoteConfig: jest.fn(() => ({
        getValue: jest.fn(),
    }))
})
jest.mock('src/helpers/locale', () => ({
    locale: () => jest.fn().mockReturnValue('en_GB'),
}))

describe('LightboxCaption', () => {
    it('should show a LightboxCaption with a pillar colour', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <LightboxCaption
                caption="Claude Gnapka scores Luton's third and winner"
                pillarColor="#0000FF"
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
