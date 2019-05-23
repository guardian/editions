// This file is symlinked into both backend and Mallard.
// Be careful.

export interface Issue {
    name: string
    fronts: string[]
}

export interface ArticleFragment {
    id: string
    frontPublicationDate: number
    publishedBy?: string
}

export interface CollectionArticles {
    id: string
    name?: string
    articles: ArticleFragment[]
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
    articles?: ArticleFragment[]
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
