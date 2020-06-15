import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { RegionButton } from '../RegionButton'

const props = {
    onPress: () => {},
    title: 'Australia Weekend',
    subTitle: 'Published every Saturday by 6am (AEST)',
}

describe('RegionButton', () => {
    it('should display a default RegionButton with correct styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <RegionButton {...props} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should display a selected RegionButton with correct styling', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <RegionButton selected={true} {...props} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
