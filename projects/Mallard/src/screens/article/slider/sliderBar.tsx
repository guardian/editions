import React from 'react'
import { Animated } from 'react-native'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { SliderSectionBar } from './sliderSectionBar'
import { SliderSection } from './types'

const SliderBar = ({
    goNext,
    goPrevious,
    sections,
    sliderPosition,
    width,
}: {
    goNext: () => void
    goPrevious: () => void
    sections: SliderSection[]
    sliderPosition: Animated.AnimatedInterpolation
    width: number
}) => {
    return (
        <MaxWidthWrap>
            {sections.map((section, index) => (
                <SliderSectionBar
                    section={section}
                    sliderPosition={sliderPosition}
                    key={section.title}
                    width={width}
                    isFirst={index === 0}
                    goNext={goNext}
                    goPrevious={goPrevious}
                />
            ))}
        </MaxWidthWrap>
    )
}

export { SliderBar }
