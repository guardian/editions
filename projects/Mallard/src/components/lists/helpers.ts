export interface Item {
    key: string
    title: string
    [k: string]: string
}

export interface PropTypes {
    data: Item[]
    onPress: (item: Item) => void
}
