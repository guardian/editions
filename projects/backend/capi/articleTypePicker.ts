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
    const isLongRead: boolean =
        isTagPresent('theguardian/journal/the-long-read') && isImmersive
    const isSeries: boolean = isTagPresent('tone/special-report') && isImmersive
    const isInterview: boolean = isTagPresent('tone/interview')
    const isObituary: boolean = isTagPresent('tone/obituaries')
    const isAnalysis: boolean = isTagPresent('tone/analysis')
    const isComment: boolean = isTagPresent('tone/comment')
    const isLetter: boolean =
        isTagPresent('tone/lettertotheeditor') && isImmersive
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
                if (isLongRead) return ArticleType.Longread
                else if (isSeries) return ArticleType.Series
                else if (isInterview) return ArticleType.Interview
                else if (isAnalysis) return ArticleType.Analysis
                else if (isObituary) return ArticleType.Obituary
                else return ArticleType.Article

            case 'sport':
                if (isMatchResult) return ArticleType.MatchResult
                else if (isInterview) return ArticleType.Interview
                else if (isLongRead) return ArticleType.Longread
                else if (isAnalysis) return ArticleType.Analysis
                else if (isObituary) return ArticleType.Obituary
                else return ArticleType.Article

            case 'opinion':
            case 'journal':
                if (isComment) return ArticleType.Opinion
                else if (isLongRead) return ArticleType.Longread
                else if (isLetter) return ArticleType.Letter
                else if (isObituary) return ArticleType.Obituary
                else if (isAnalysis) return ArticleType.Analysis
                else return ArticleType.Article

            case 'lifestyle':
                if (isRecipe) return ArticleType.Recipe
                else if (isInterview) return ArticleType.Interview
                else if (isObituary) return ArticleType.Obituary
                else if (isReview) return ArticleType.Review
                else if (isGallery) return ArticleType.Gallery
                else if (isAnalysis) return ArticleType.Analysis
                else if (isFeature) return ArticleType.Feature
                else if (isImmersive) return ArticleType.Immersive
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
                else if (isObituary) return ArticleType.Obituary
                else if (isFeature) return ArticleType.Feature
                else if (isAnalysis) return ArticleType.Analysis
                else if (isImmersive) return ArticleType.Immersive
                else return ArticleType.Article

            default:
                return ArticleType.Article
        }
    } else {
        return ArticleType.Article
    }
}

export { articleTypePicker }
