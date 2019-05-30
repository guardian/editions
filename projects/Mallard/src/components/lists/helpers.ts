export interface Item<ItemData> {
    key: string
    title: string
    explainer?: string
    data?: ItemData
}

export type OnPressHandler<ItemData> = (item: ItemData) => void
export interface PropTypes<ItemData> {
    data: Item<ItemData>[]
    onPress: OnPressHandler<Item<ItemData>>
}
