import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-navigation'
import { ArticleType, ArticlePillar } from 'src/common'
import { ArticleController } from 'src/components/article'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { UiBodyCopy } from 'src/components/styled-text'
import { WithArticle } from 'src/hooks/use-article'
import { useArticleResponse } from 'src/hooks/use-issue'
import { color } from 'src/theme/color'
import { PathToArticle } from '../article-screen'
import { useIsPreview } from 'src/hooks/use-settings'

const styles = StyleSheet.create({
    flex: { flexGrow: 1 },
    container: { height: '100%' },
})

const ArticleScreenBody = React.memo<{
    path: PathToArticle
    onTopPositionChange: (isAtTop: boolean) => void
    pillar: ArticlePillar
    width: number
    position?: number
}>(({ path, onTopPositionChange, pillar, width, position }) => {
    const articleResponse = useArticleResponse(path)
    const preview = useIsPreview()
    const previewNotice = preview ? `${path.collection}:${position}` : undefined

    return (
        <ScrollView
            scrollEventThrottle={8}
            onScroll={ev => {
                onTopPositionChange(ev.nativeEvent.contentOffset.y <= 0)
            }}
            style={[styles.container, { width }]}
            contentContainerStyle={styles.flex}
        >
            {articleResponse({
                error: ({ message }) => (
                    <FlexErrorMessage
                        title={message}
                        style={{ backgroundColor: color.background }}
                    />
                ),
                pending: () => (
                    <FlexErrorMessage
                        title={'loading'}
                        style={{ backgroundColor: color.background }}
                    />
                ),
                success: article => (
                    <>
                        {previewNotice && (
                            <UiBodyCopy>{previewNotice}</UiBodyCopy>
                        )}
                        <WithArticle
                            type={
                                article.article.articleType ||
                                ArticleType.Article
                            }
                            pillar={pillar}
                        >
                            <ArticleController article={article.article} />
                        </WithArticle>
                    </>
                ),
            })}
        </ScrollView>
    )
})

export { ArticleScreenBody }
