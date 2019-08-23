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
import { ModalRenderer } from '../../components/modal'

const styles = StyleSheet.create({
    flex: { flexGrow: 1 },
})

const ArticleScreenBody = ({
    path,
    onTopPositionChange,
    pillar,
    width,
    previewNotice,
}: {
    path: PathToArticle
    onTopPositionChange: (isAtTop: boolean) => void
    pillar: ArticlePillar
    width: number
    previewNotice?: string
}) => {
    const articleResponse = useArticleResponse(path)

    return (
        <>
            <ScrollView
                scrollEventThrottle={8}
                onScroll={ev => {
                    onTopPositionChange(ev.nativeEvent.contentOffset.y <= 0)
                }}
                style={{ width }}
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
            <ModalRenderer />
        </>
    )
}

export { ArticleScreenBody }
