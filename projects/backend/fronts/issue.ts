export interface PublishedIssue {
    id: string
    name: string
    fronts: PublishedFront[]
    issueDate: string
}
export interface PublishedFront {
    id: string
    name: string
    collections: PublishedCollection[]
}
export interface PublishedCollection {
    id: string
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
    mediaType: 'UseArticleTrail' | 'Hide' | 'Cutout' | 'Slideshow' | 'Image'
    imageSrcOverride?: PublishedImage
    slideshowImages?: PublishedImage[]
}
