export interface ItemData {
    [k: string]: string
}
export interface Item {
    key: string
    title: string
    explainer?: string
    data?: ItemData
}

export type OnPressHandler = (item: ItemData) => void
export interface PropTypes {
    data: Item[]
    onPress: OnPressHandler
}
