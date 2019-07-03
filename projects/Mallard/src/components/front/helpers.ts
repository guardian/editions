import { FunctionComponent } from 'react'
import { PropTypes } from './item/item'
import { FlatList } from 'react-native'
import { Dimensions, Animated } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { Front } from 'src/common'

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

export enum RowSize {
    row,
    third,
    half,
    hero,
    superhero,
    splash,
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
    const heights = {
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
