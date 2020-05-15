import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { LightboxImage } from '../LightboxImage'

const image = {
    path:
        'daily-edition/2020-04-16/2020-04-16T00:52:50.881Z/media/tablet/media/02e9fb24dbd5a864953ffaf7c0525c778c9f1aad/0_159_2968_1782/master/2968.jpg',
    source: 'media',
}

describe('LightboxImage', () => {
    it('should show a default LightboxImage', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <LightboxImage image={image} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
