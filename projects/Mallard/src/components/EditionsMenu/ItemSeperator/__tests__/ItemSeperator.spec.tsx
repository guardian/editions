import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ItemSeperator } from '../ItemSeperator'

describe('ItemSeperator', () => {
    it('should display a default ItemSeperator with correct styling used for RegionButton seperation', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ItemSeperator />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
