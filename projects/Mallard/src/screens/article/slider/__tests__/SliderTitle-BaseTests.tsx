import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { SliderTitle } from '../SliderTitle'
import { Animated } from 'react-native'

const sliderDetails = {
    title: 'Top Stories',
    numOfItems: 3,
    color: '#000000',
    position: new Animated.Value(3),
}

const baseTests = (title: string) =>
    describe(title, () => {
        it('should display a Front SliderTitle with the correct styles', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle {...sliderDetails} location="front" />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display an Article SliderTitle with the correct styles', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle {...sliderDetails} location="article" />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display an Front SliderTitle with a subtitle the same as the title', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle
                    {...sliderDetails}
                    location="front"
                    subtitle="0:Top Stories"
                />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display an Article SliderTitle with a subtitle the same as the title', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle
                    {...sliderDetails}
                    location="article"
                    subtitle="0:Top Stories"
                />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display an Front SliderTitle with a subtitle different to the title', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle
                    {...sliderDetails}
                    location="front"
                    subtitle="0:Scary News"
                />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display an Article SliderTitle with a subtitle different to the title', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle
                    {...sliderDetails}
                    location="article"
                    subtitle="0:Scary News"
                />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display an default SliderTitle with a prescribed start index', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle {...sliderDetails} startIndex={2} />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })

        it('should display no dots when numOfItems is 1 or less', () => {
            const component: ReactTestRendererJSON | null = TestRenderer.create(
                <SliderTitle {...sliderDetails} numOfItems={1} />,
            ).toJSON()
            expect(component).toMatchSnapshot()
        })
    })

export { baseTests }
