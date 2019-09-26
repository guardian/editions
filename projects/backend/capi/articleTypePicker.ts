import { IContent } from '@guardian/capi-ts/dist/Content'
import { ArticleType } from '../../common/src/index'

const doesTagExist = (article: IContent, tagId: string): boolean => {
    return article.tags.find(tag => tag.id === tagId) != undefined
}

const articleTypePicker = (article: IContent): ArticleType => {
    const isTagPresent = (tagId: string): boolean =>
        doesTagExist(article, tagId)

    const isImmersive: boolean =
        (article.fields && article.fields.displayHint === 'immersive') || false
    const isLongRead: boolean = isTagPresent(
        'theguardian/journal/the-long-read',
    )
    const isSeries: boolean = isTagPresent('tone/special-report') && isImmersive
    const isInterview: boolean = isTagPresent('tone/interview')
    const isObituary: boolean = isTagPresent('tone/obituaries')
    const isAnalysis: boolean = isTagPresent('tone/analysis')
    const isComment: boolean = isTagPresent('tone/comment')
    const isLetter: boolean = isTagPresent('tone/letters')
    const isFeature: boolean = isTagPresent('tone/features')
    const isGallery: boolean = isTagPresent('type/gallery')
    const isReview: boolean = isTagPresent('tone/reviews')
    const isRecipe: boolean = isTagPresent('tone/recipes')
    const isMatchResult: boolean = isTagPresent('tone/matchreports')

    /**
     * Order of conditionals under each pillar is important as certain conditions take precedent.
     */
    if (article.pillarName) {
        switch (article.pillarName.toLowerCase()) {
            case 'news':
                if (isSeries) return ArticleType.Series
                else if (isLongRead) return ArticleType.Longread
                else if (isImmersive) return ArticleType.Immersive
                else if (isInterview) return ArticleType.Interview
                else if (isObituary) return ArticleType.Obituary
                else if (isAnalysis) return ArticleType.Analysis
                else if (isLetter) return ArticleType.Letter
                else if (isComment) return ArticleType.Opinion
                else if (isReview) return ArticleType.Review
                else return ArticleType.Article

            case 'sport':
                if (isSeries) return ArticleType.Series
                else if (isLongRead) return ArticleType.Longread
                else if (isImmersive) return ArticleType.Immersive
                else if (isInterview) return ArticleType.Interview
                else if (isMatchResult) return ArticleType.MatchResult
                else if (isObituary) return ArticleType.Obituary
                else if (isAnalysis) return ArticleType.Analysis
                else if (isLetter) return ArticleType.Letter
                else if (isComment) return ArticleType.Opinion
                else return ArticleType.Article

            case 'opinion':
            case 'journal':
                if (isSeries) return ArticleType.Series
                else if (isLongRead) return ArticleType.Longread
                else if (isImmersive) return ArticleType.Immersive
                else if (isObituary) return ArticleType.Obituary
                else if (isAnalysis) return ArticleType.Analysis
                else if (isLetter) return ArticleType.Letter
                else if (isComment) return ArticleType.Opinion
                else return ArticleType.Article

            case 'lifestyle':
                if (isLongRead) return ArticleType.Longread
                else if (isImmersive) return ArticleType.Immersive
                else if (isReview) return ArticleType.Review
                else if (isRecipe) return ArticleType.Recipe
                else if (isInterview) return ArticleType.Immersive
                else if (isObituary) return ArticleType.Obituary
                else if (isAnalysis) return ArticleType.Analysis
                else if (isGallery) return ArticleType.Gallery
                else if (isFeature) return ArticleType.Feature
                else if (isLetter) return ArticleType.Letter
                else if (isComment) return ArticleType.Opinion
                else return ArticleType.Article

            case 'culture':
            case 'film':
            case 'music':
            case 'books':
            case 'stage':
            case 'games':
            case 'classical':
            case 'arts':
                if (isReview) return ArticleType.Review
                else if (isLongRead) return ArticleType.Longread
                else if (isImmersive) return ArticleType.Immersive
                else if (isInterview) return ArticleType.Immersive
                else if (isObituary) return ArticleType.Obituary
                else if (isAnalysis) return ArticleType.Analysis
                else if (isFeature) return ArticleType.Feature
                else if (isLetter) return ArticleType.Letter
                else if (isComment) return ArticleType.Opinion
                else return ArticleType.Article

            default:
                return ArticleType.Article
        }
    } else {
        return ArticleType.Article
    }
}

export { articleTypePicker }
