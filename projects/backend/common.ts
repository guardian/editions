import { IBlockElement } from '@guardian/capi-ts'

// This file is symlinked into both backend and Mallard.
// Be careful.
export type Article = IBlockElement[][]

export interface Issue {
    name: string
    fronts: string[]
}

export interface CollectionArticles {
    id: string
    name: string
    articles: string[]
}
export interface Collection {
    displayName: string
    type: string
    backfill?: unknown
    href?: string
    groups?: string[]
    metadata?: unknown[]
    uneditable?: boolean
    showTags?: boolean
    hideKickers?: boolean
    excludedFromRss?: boolean
    description?: string
    showSections?: boolean
    showDateHeader?: boolean
    showLatestUpdate?: boolean
    excludeFromRss?: boolean
    hideShowMore?: boolean
    platform?: unknown
    frontsToolSettings?: unknown
    articles?: string[]
}

export interface Front {
    collections: { [key: string]: Collection }
    canonical?: string
    group?: string
    isHidden?: boolean
    isImageDisplayed?: boolean
    imageHeight?: number
    imageWidth?: number
    imageUrl?: string
    onPageDescription?: string
    description?: string
    title?: string
    webTitle?: string
    navSection?: string
}

export interface UnknownElement {
    id: 'unknown'
}
export interface HTMLElement {
    id: 'html'
    html: string
}
export interface ImageElement {
    id: 'image'
    src: string
}
export type BlockElement = HTMLElement | ImageElement | UnknownElement
