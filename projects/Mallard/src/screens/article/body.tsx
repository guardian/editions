import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ArticlePillar, ArticleType } from 'src/common'
import { ArticleController } from 'src/components/article'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { UiBodyCopy } from 'src/components/styled-text'
import { WithArticle, getCollectionPillarOverride } from 'src/hooks/use-article'
import { useArticleResponse } from 'src/hooks/use-issue'
import { useIsPreview } from 'src/hooks/use-settings'
import { PathToArticle } from 'src/paths'
import { color } from 'src/theme/color'
import { HeaderControlProps } from 'src/components/article/types/article'

const styles = StyleSheet.create({
    flex: { flexGrow: 1 },
    container: { height: '100%' },
})

const ArticleScreenBody = React.memo<
    {
        path: PathToArticle
        pillar: ArticlePillar
        width: number
        position?: number
    } & HeaderControlProps
>(({ path, pillar, width, position, ...headerControlProps }) => {
    const articleResponse = useArticleResponse(path)
    const preview = useIsPreview()
    const previewNotice = preview ? `${path.collection}:${position}` : undefined

    return (
        <View style={[styles.container, { width }]}>
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
                            pillar={getCollectionPillarOverride(
                                pillar,
                                path.collection,
                            )}
                        >
                            <ArticleController
                                article={article.article}
                                {...headerControlProps}
                            />
                        </WithArticle>
                    </>
                ),
            })}
        </View>
    )
})

export { ArticleScreenBody }
