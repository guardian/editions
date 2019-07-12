export interface IssueResponse {
    id: string
    name: string
    fronts: FrontResponse[]
    issueDate: string
}
export interface FrontResponse {
    id: string
    name: string
    collections: CollectionResponse[]
}
export interface CollectionResponse {
    id: string
    items: ItemResponse[]
}
export interface ItemResponse {
    internalPageCode: number
    meta: ItemResponseMeta
}
export interface ItemResponseMeta {
    kicker?: string
    headline?: string
    imageSrc?: string
}
