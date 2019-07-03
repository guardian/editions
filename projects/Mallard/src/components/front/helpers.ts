import { FunctionComponent } from 'react'
import { PropTypes } from './item/item'

type Item = FunctionComponent<PropTypes>
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
