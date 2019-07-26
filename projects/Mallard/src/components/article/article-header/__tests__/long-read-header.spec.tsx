import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { LongReadHeader } from '..'

describe('LongReadHeader', () => {
    it('should show a full featured long read header', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <LongReadHeader
                image={{ source: 'media', path: 'path/to/image.png' }}
                headline="Theresa May makes final speech as PM"
                standfirst="Rolling coverage of the day’s political developments as they happen"
                byline="Andrew Sparrow"
                kicker="News"
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should show long read header without an image or a kicker', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <LongReadHeader
                headline="Theresa May makes final speech as PM"
                standfirst="Rolling coverage of the day’s political developments as they happen"
                byline="Andrew Sparrow"
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
