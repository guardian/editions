interface WithKey {
    key: string
}

export interface Card {
    layout: null
    articles: { [key: string]: Article }
}

export interface Article extends WithKey {
    headline: string
    kicker: string
    image: string
    byline: string
    standfirst: string
    imageURL?: string
    elements: BlockElement[]
}

export interface Issue extends WithKey {
    name: string
    date: number
    fronts: Front['key'][]
}

export interface Collection extends WithKey {
    displayName: string
    cards: Card[]
    preview?: true
}

export interface Front extends WithKey {
    collections: Collection[]
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

const issuePath = (issueId: string) => `${issueId}/issue`
const frontPath = (issueId: string, frontId: string) =>
    `${issuePath(issueId)}/front/${frontId}`
const collectionPath = (issueId: string, collectionId: string) =>
    `${issuePath(issueId)}/collection/${collectionId}`

export { issuePath, frontPath, collectionPath }
