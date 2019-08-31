import { MediaType } from '../common'

export interface PublishedIssue {
    id: string
    name: string
    fronts: PublishedFront[]
    issueDate: string
}
export type Swatch =
    | 'neutral'
    | 'news'
    | 'opinion'
    | 'culture'
    | 'lifestyle'
    | 'sport'
    | 'special'
export interface PublishedFront {
    id: string
    name: string
    collections: PublishedCollection[]
    swatch: Swatch
}
export interface PublishedCollection {
    id: string
    name: string
    items: PublishedArticle[]
}
export interface PublishedArticle {
    internalPageCode: number
    furniture: PublishedFurtniture
}
export interface PublishedImage {
    height: number
    width: number
    src: string
}
export interface PublishedFurtniture {
    kicker?: string
    headlineOverride?: string
    trailTextOverride?: string
    bylineOverride?: string
    showByline: boolean
    showQuotedHeadline: boolean
    mediaType: MediaType
    imageSrcOverride?: PublishedImage
    slideshowImages?: PublishedImage[]
    sportScore?: string
}
