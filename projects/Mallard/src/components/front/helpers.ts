import { FunctionComponent } from 'react'
import { PropTypes } from './item/item'
import { FlatList } from 'react-native'
import { Dimensions, Animated } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { Front } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { useAppAppearance } from 'src/theme/appearance'

type Item = FunctionComponent<PropTypes>

export interface AnimatedFlatListRef {
    _component: FlatList<Front['collections'][0]>
}

type Size = {
    width: number
    height: number
}

export type ItemFit = Size & {
    top: number
    left: number
}
export type ItemSizes = { story: ItemFit; layout: PageLayoutSizes }

export enum PageLayoutSizes {
    mobile,
    tablet,
}
export type PageLayout = {
    size: PageLayoutSizes
    items: {
        item: Item
        fits: ItemFit
    }[]
}

export const getPageLayoutSizeXY = (size: PageLayoutSizes): Size => {
    if (size === PageLayoutSizes.tablet) {
        return { width: 3, height: 4 }
    }
    return { width: 2, height: 6 }
}

/*
This resolves where each article goes
*/

export const getItemPosition = (
    itemFit: ItemFit,
    layout: PageLayout['size'],
) => {
    const layoutSize = getPageLayoutSizeXY(layout)
    return {
        left: `${(itemFit.left / layoutSize.width) * 100}%`,
        top: `${(itemFit.top / layoutSize.height) * 100}%`,
        height: `${(itemFit.height / layoutSize.height) * 100}%`,
        width: `${(itemFit.width / layoutSize.width) * 100}%`,
    }
}

/*
Map the position of the tap on the screen to
the position of the tap on the scrubber itself (which has padding).
This is coupled to the visual layout and we can be a bit more
clever but also for now this works
*/
export const getScrollPos = (screenX: number) => {
    const { width } = Dimensions.get('window')
    return screenX + (metrics.horizontal * 6 * screenX) / width
}

export const getNearestPage = (screenX: number, pageCount: number): number => {
    const { width } = Dimensions.get('window')
    return Math.round((getScrollPos(screenX) * (pageCount - 1)) / width)
}

export const getTranslateForPage = (scrollX: Animated.Value, page: number) => {
    const { width } = Dimensions.get('window')
    return scrollX.interpolate({
        inputRange: [width * (page - 1), width * page, width * (page + 1)],
        outputRange: [
            metrics.frontsPageSides * -1.75,
            0,
            metrics.frontsPageSides * 1.75,
        ],
    })
}

/*get the card bg */
export const useCardBackgroundStyle = () => {
    const [color, { pillar }] = useArticle()
    const appColor = useAppAppearance()
    return pillar !== 'news' && pillar !== 'sport'
        ? { backgroundColor: color.faded }
        : { backgroundColor: appColor.cardBackgroundColor }
}

export const useKickerColorStyle = () => {
    const [color] = useArticle()
    return { color: color.main }
}
