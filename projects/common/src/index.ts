import { cardLayouts } from './collection/card-layouts'

interface WithKey {
    key: string
}

export type ColorFromPalette =
    | 'news'
    | 'opinion'
    | 'sport'
    | 'culture'
    | 'lifestyle'
    | 'neutral'

interface WithCustomColor {
    color: 'custom'
    customColor: string
}
interface WithPillar {
    color: ColorFromPalette
}

export type WithColor = WithCustomColor | WithPillar

export interface Card {
    layout: null
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

export interface Article extends WithKey {
    type: 'article'
    headline: string
    kicker: string
    image: Image
    byline: string
    standfirst: string
    elements: BlockElement[]
}

export interface CrosswordArticle extends WithKey {
    type: 'crossword'
    headline: string
    kicker: string
    byline?: string
    standfirst?: string
    crossword: Crossword
}

export interface GalleryArticle extends WithKey {
    type: 'gallery'
    headline: string
    kicker: string
    byline?: string
    standfirst?: string
    image?: Image
    elements: BlockElement[]
}

export type CAPIArticle = Article | CrosswordArticle | GalleryArticle

export interface IssueSummary extends WithKey {
    name: string
    id: string
    date: string
}

export interface Issue extends IssueSummary, WithKey {
    fronts: Front['key'][]
}

export interface Collection extends WithKey {
    cards: Card[]
}

export type Front = WithColor &
    WithKey & {
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
    src: Image
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

export type CollectionCardLayout = number[]
export interface CollectionCardLayouts {
    [countOfArticles: number]: CollectionCardLayout
}

const issuePath = (issueId: string) => `${issueId}/issue`
const frontPath = (issueId: string, frontId: string) =>
    `${issuePath(issueId)}/front/${frontId}`

const issueSummaryPath = () => 'issues'
export const imageSizes = ['sample', 'phone', 'tablet'] as const
export interface Image {
    source: string
    path: string
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
export type ImageSize = typeof imageSizes[number]

const mediaPath = (
    issue: string,
    size: ImageSize,
    source: string,
    path: string,
) => `${issuePath(issue)}/media/${size}/${source}/${path}`

const coloursPath = (issue: string, source: string, path: string) =>
    `${issuePath(issue)}/colours/${source}/${path}`

export {
    issuePath,
    mediaPath,
    frontPath,
    issueSummaryPath,
    cardLayouts,
    coloursPath,
}
