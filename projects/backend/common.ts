// This file is symlinked into both backend and Mallard.
// Be careful.

export type ArticleFromTheCollectionsAtm = string
export interface ArticleFundamentals {
    title: string
    imageURL?: string
}
export interface Article extends ArticleFundamentals {
    elements: BlockElement[]
}

export interface Issue {
    name: string
    date: number
    fronts: string[]
}
export interface FrontArticle {
    path: string
    headline: string
    kicker: string
    image: string
}
export interface CollectionArticles {
    id: string
    name: string
    articles: FrontArticle[]
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
    articles?: FrontArticle[]
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
    alt?: string
    caption?: string
    copyright?: string
}
export interface TweetElement {
    id: 'tweet'
    url: string
    html: string
}
export interface PullquoteElement {
    id: 'pullquote'
    html: string
    role?: string
}

export interface AtomElement {
    id: '⚛︎'
    atomType: string
    html?: string
    css?: string[]
    js?: string[]
}
export type BlockElement =
    | HTMLElement
    | ImageElement
    | UnknownElement
    | TweetElement
    | AtomElement
    | PullquoteElement
