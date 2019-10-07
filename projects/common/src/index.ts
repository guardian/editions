import { FrontCardAppearance } from './collection/card-layouts'
export * from './collection/card-layouts'
export * from './collection/layout-model'
export * from './collection/layouts'
export * from './collection/thumbnails'
export * from './helpers/sizes'

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

interface AccuWeatherRegion {
    ID: string
    LocalizedName: string
    EnglishName: string
}

type AccuWeatherAdminArea = AccuWeatherRegion & {
    Level: number
    LocalizedType: string
    EnglishType: string
    CountryID: string
}

interface AccuweatherSupplementalAdminArea {
    Level: number
    LocalizedName: string
    EnglishName: string
}

interface AccuWeatherTimezone {
    Code: string
    Name: string
    GmtOffset: number
    IsDaylightSaving: boolean
    NextOffsetChange: string
}

interface AccuWeatherMeasurement {
    Value: number
    Unit: string
    UnitType: number
}

interface AccuWeatherElevation {
    Metric: AccuWeatherMeasurement
    Imperial: AccuWeatherMeasurement
}

interface AccuWeatherGeoPosition {
    Latitude: number
    Longitude: number
    Elevation: AccuWeatherElevation
}

export interface AccuWeatherLocation {
    Version: number
    Key: string
    Type: string
    Rank: number
    LocalizedName: string
    EnglishName: string
    PrimaryPostalCode: string
    Region: AccuWeatherRegion
    Country: AccuWeatherRegion
    AdministrativeArea: AccuWeatherAdminArea
    TimeZone: AccuWeatherTimezone
    GeoPosition: AccuWeatherGeoPosition
    IsAlias: boolean
    SupplementalAdminAreas: AccuweatherSupplementalAdminArea[]
    DataSets: string[]
}

export interface WeatherForecast {
    locationName: string
    forecasts: Forecast[]
}

export type MediaType =
    | 'UseArticleTrail'
    | 'Hide'
    | 'Cutout'
    | 'Slideshow'
    | 'Image'
    | 'coverCard'

export interface Content extends WithKey {
    type: string
    headline: string
    kicker: string
    articleType?: ArticleType
    trail: string
    image?: CreditedImage
    trailImage?: Image
    cardImage?: Image
    cardImageTablet?: Image
    standfirst?: string
    byline?: string
    bylineHtml?: string
    bylineImages?: { cutout?: Image }
    showByline: boolean
    showQuotedHeadline: boolean
    mediaType: MediaType
    sportScore?: string
}
export interface Article extends Content {
    type: 'article'
    byline: string
    bylineHtml: string
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

export const Editions = [
    'daily-edition',
    'american-edition',
    'australian-edition',
    'training-edition',
] as const

export type Edition = typeof Editions[number]

export interface IssueIdentifier {
    edition: Edition
    issueDate: string
}

export interface IssuePublicationIdentifier extends IssueIdentifier {
    version: string
}

export interface IssueSummary extends WithKey, IssueCompositeKey {
    name: string
    date: string
    assets?: {
        [P in ImageSize]?: string
    } & { data: string }
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
    hasDropCap?: boolean
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
    attribution?: string
}

export interface AtomElement {
    id: 'atom'
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
    QUICK = 'quick',
    CRYPTIC = 'cryptic',
    QUIPTIC = 'quiptic',
    SPEEDY = 'speedy',
    PRIZE = 'prize',
    EVERYMAN = 'everyman',
    DIAN_QUIPTIC_CROSSWORD = 'quiptic-dian',
    WEEKEND = 'weekend',
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
export interface IssueCompositeKey {
    publishedId: string
    localId: string
}

export const issueDir = (issueId: string) => {
    return issueId
}

export const issuePath = (issue: string) => `${issueDir(issue)}/issue`

// const issuePath = (issueId: string) => `${issueDir(issueId)}issue`
export const frontPath = (issue: string, frontId: string) =>
    `${issueDir(issue)}/front/${frontId}`

// These have issueids in the path, but you'll need to change the archiver if you want to use them.

export const mediaDir = (issue: string, size: ImageSize) =>
    `${issueDir(issue)}/media/${size}`

export const mediaPath = (
    issue: string,
    size: ImageSize,
    source: string,
    path: string,
) => `${mediaDir(issue, size)}/${source}/${path}`

export const coloursPath = (issue: string, source: string, path: string) =>
    `${issueDir(issue)}/colours/${source}/${path}`

export const issueSummaryPath = (edition: string) => `${edition}/issues`
export interface Image {
    source: string
    path: string
}

export type ImageUse = 'full-size' | 'thumb' | 'thumb-large' | 'not-used'

export interface TrailImage extends Image {
    mobileImageUse: ImageUse
    tabletImageUse: ImageUse
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
