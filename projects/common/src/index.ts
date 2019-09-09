import { FrontCardAppearance } from './collection/card-layouts'
export * from './collection/card-layouts'

export interface WithKey {
    key: string
}

export const articlePillars = [
    'news',
    'opinion',
    'sport',
    'culture',
    'lifestyle',
    'neutral',
] as const

export enum ArticleType {
    Article = 'article',
    Longread = 'longread',
    Review = 'review',
    Opinion = 'opinion',
    Series = 'series',
    Interview = 'interview',
    Analysis = 'analysis',
    Obituary = 'obituary',
    MatchResult = 'matchresult',
    Letter = 'letter',
    Recipe = 'recipe',
    Gallery = 'gallery',
    Feature = 'feature',
    Immersive = 'immersive',
}

export enum ArticleFeatures {
    HasDropCap = 'HAS-DROP-CAP',
    HasFancyDropCap = 'HAS-FANCY-DROP-CAP',
}

export type ArticlePillar = typeof articlePillars[number]

export interface ColorAppearance {
    type: 'custom'
    color: string
}
export interface PillarAppearance {
    type: 'pillar'
    name: ArticlePillar
}

export type Appearance = PillarAppearance | ColorAppearance

export interface Card {
    appearance: FrontCardAppearance | null
    articles: { [key: string]: CAPIArticle }
}

export interface Temperature {
    Value: number
    Unit: string
    UnitType: number
}

export interface Forecast {
    DateTime: string
    EpochDateTime: number
    WeatherIcon: number
    IconPhrase: string
    HasPrecipitation: false
    IsDaylight: true
    Temperature: Temperature
    PrecipitationProbability: number
    MobileLink: string
    Link: string
}
export type MediaType =
    | 'UseArticleTrail'
    | 'Hide'
    | 'Cutout'
    | 'Slideshow'
    | 'Image'
export interface Content extends WithKey {
    type: string
    headline: string
    kicker: string
    articleType?: ArticleType
    trail: string
    image?: CreditedImage
    cardImage?: Image
    cardImageTablet?: Image
    standfirst?: string
    byline?: string
    bylineImages?: { thumbnail?: Image; cutout?: Image }
    showByline: boolean
    showQuotedHeadline: boolean
    mediaType: MediaType
    sportScore?: string
}
export interface Article extends Content {
    type: 'article'
    byline: string
    standfirst: string
    elements: BlockElement[]
    starRating?: number
}

export interface CrosswordArticle extends Content {
    type: 'crossword'
    crossword: Crossword
}

export interface GalleryArticle extends Content {
    type: 'gallery'
    elements: BlockElement[]
}

export interface PictureArticle extends Content {
    type: 'picture'
    elements: BlockElement[]
}

export type CAPIArticle =
    | Article
    | CrosswordArticle
    | GalleryArticle
    | PictureArticle
export const imageSizes = ['phone', 'tablet', 'tabletL', 'tabletXL'] as const
export type ImageSize = typeof imageSizes[number]

export const sizeDescriptions: { [k in ImageSize]: number } = {
    phone: 375,
    tablet: 740,
    tabletL: 980,
    tabletXL: 1140,
}

export interface IssueSummary extends WithKey {
    name: string
    date: string
    id: IssueId
    assets?: {
        [P in ImageSize]?: string[]
    } & { data: string[] }
}

export interface Issue extends IssueSummary, WithKey {
    fronts: Front['key'][]
}

export interface Collection extends WithKey {
    cards: Card[]
}

export type Front = WithKey & {
    collections: Collection[]
    displayName?: string
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
    appearance: Appearance
}

export interface UnknownElement {
    id: 'unknown'
}
export interface HTMLElement {
    id: 'html'
    html: string
}

type ImageRoles = 'supporting' | 'immersive' | 'showcase' | 'thumbnail' | string

export interface ImageElement {
    id: 'image'
    src: Image
    alt?: string
    caption?: string
    copyright?: string
    credit?: string
    role?: ImageRoles
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
    atomId: string
    html?: string
    css?: string[]
    js?: string[]
}

export interface MediaAtomElement {
    id: 'media-atom'
    atomId: string
    image?: Image
    html: string
    platform?: 'youtube' | 'dailymotion' | 'mainstream' | 'url'
    assetId?: string
    title?: string
}

export type BlockElement =
    | HTMLElement
    | ImageElement
    | UnknownElement
    | TweetElement
    | AtomElement
    | MediaAtomElement
    | PullquoteElement

export interface CrosswordDimensions {
    cols: number
    rows: number
}

export interface CrosswordPosition {
    x: number
    y: number
}

export interface CrosswordCreator {
    name: string
    webUrl: string
}

export interface CrosswordEntry {
    id: string
    number?: number
    humanNumber?: string
    direction?: string
    position?: CrosswordPosition
    separatorLocations?: { [key: string]: number[] }
    length?: number
    clue?: string
    group?: string[]
    solution?: string
    format?: string
}

export enum CrosswordType {
    QUICK = 0,
    CRYPTIC = 1,
    QUIPTIC = 2,
    SPEEDY = 3,
    PRIZE = 4,
    EVERYMAN = 5,
    DIAN_QUIPTIC_CROSSWORD = 6,
    WEEKEND = 7,
}

export interface CapiDateTime {
    dateTime: number
    iso8601: string
}

export interface Crossword {
    name: string
    type: CrosswordType
    number: number
    date: CapiDateTime
    dimensions: CrosswordDimensions
    entries: CrosswordEntry[]
    solutionAvailable: boolean
    hasNumbers: boolean
    randomCluesOrdering: boolean
    instructions?: string
    creator?: CrosswordCreator
    pdf?: string
    annotatedSolution?: string
    dateSolutionAvailable?: CapiDateTime
}
export interface IssueId {
    edition: 'daily-edition'
    issueDate: string
    version: string
}

export const issueDir = (issueId: IssueId | string) => {
    if (typeof issueId === 'string') {
        return issueId
    }
    const { edition, version, issueDate } = issueId
    return `${edition}/${issueDate}/${version}`
}

export const issuePath = (issue: IssueId | string) => `${issueDir(issue)}/issue`

// const issuePath = (issueId: string) => `${issueDir(issueId)}issue`
export const frontPath = (issue: IssueId | string, frontId: string) =>
    `${issueDir(issue)}/front/${frontId}`

// These have issueids in the path, but you'll need to change the archiver if you want to use them.

export const mediaDir = (issue: IssueId | string, size: ImageSize) =>
    `${issueDir(issue)}/media/${size}`

export const mediaPath = (
    issue: IssueId | string,
    size: ImageSize,
    source: string,
    path: string,
) => `${mediaDir(issue, size)}/${source}/${path}`

export const coloursPath = (
    issue: IssueId | string,
    source: string,
    path: string,
) => `${issueDir(issue)}/colours/${source}/${path}`

export const issueSummaryPath = () => 'issues'
export interface Image {
    source: string
    path: string
}

export interface CreditedImage extends Image {
    credit?: string
}
export interface Palette {
    //the palette from node-vibrant
    Vibrant?: string
    Muted?: string
    DarkVibrant?: string
    DarkMuted?: string
    LightVibrant?: string
    LightMuted?: string
}

export const notNull = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined
