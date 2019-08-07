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

interface ItemLayoutDefinition {
    Item: Item
    slot: number
}
interface AbstractRowLayout<I> {
    size: RowSize
    columns: [I] | [I, I]
}

type AbstractPageLayout<I> = AbstractRowLayout<I>[]
type LazyPageLayout = AbstractPageLayout<Item>

export type PageLayout = AbstractPageLayout<ItemLayoutDefinition>
export type RowLayout = AbstractRowLayout<ItemLayoutDefinition>

export type StartingCoordinatesXY = { top: number; left: number }
export type SizeXY = { width: number; height: number }
export type ItemFit = StartingCoordinatesXY & SizeXY

export type ItemSizes = { story: SizeXY; layout: PageLayoutSizes }

export enum PageLayoutSizes {
    mobile,
    tablet,
}
export type NewPageLayout = {
    size: PageLayoutSizes
    items: {
        item: Item
        fits: ItemFit
    }[]
}

export const getPageLayoutSizeXY = (size: PageLayoutSizes): SizeXY => {
    if (size === PageLayoutSizes.tablet) {
        return { width: 3, height: 4 }
    }
    return { width: 2, height: 6 }
}

export enum RowSize {
    row,
    third,
    half,
    hero,
    superhero,
}

/*
This resolves where each article goes
*/

export const withSlots = (page: LazyPageLayout): PageLayout => {
    let slot = 0
    return page.map(({ columns, ...row }) => {
        if (columns.length === 1) {
            return {
                ...row,
                columns: [
                    {
                        slot: slot++,
                        Item: columns[0],
                    },
                ],
            }
        }
        return {
            ...row,
            columns: [
                {
                    slot: slot++,
                    Item: columns[0],
                },
                {
                    slot: slot++,
                    Item: columns[1],
                },
            ],
        }
    })
}

export const getRowHeightForSize = (size: RowSize): string => {
    const heights: { [size in RowSize]: string } = {
        [RowSize.row]: `${(1 / 6) * 100}%`,
        [RowSize.third]: `${(2 / 6) * 100}%`,
        [RowSize.half]: '50%',
        [RowSize.hero]: `${(4 / 6) * 100}%`,
        [RowSize.superhero]: '100%',
    }

    return heights[size]
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
