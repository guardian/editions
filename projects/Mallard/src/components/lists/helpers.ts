export interface ItemData {
    [k: string]: string
}
export interface Item {
    key: string
    title: string
    explainer?: string
    data?: ItemData
}

export interface PropTypes {
    data: Item[]
    onPress: (item: ItemData) => void
}
