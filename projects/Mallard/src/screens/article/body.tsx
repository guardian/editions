import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-navigation'
import { articlePillars, ArticleType, PillarFromPalette } from 'src/common'
import { ArticleController } from 'src/components/article'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { UiBodyCopy } from 'src/components/styled-text'
import { WithArticle } from 'src/hooks/use-article'
import { useArticleResponse } from 'src/hooks/use-issue'
import { useSettingsValue } from 'src/hooks/use-settings'
import { color } from 'src/theme/color'
import { PathToArticle } from '../article-screen'
import { DevTools, getEnumPosition } from './dev-tools'
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
    pillar: PillarFromPalette
    width: number
    previewNotice?: string
}) => {
    const [modifiedPillar, setPillar] = useState(
        articlePillars.indexOf(pillar) || 0,
    )
    const [modifiedType, setType] = useState(0)
    const articleResponse = useArticleResponse(path)
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()

    return (
        <>
            <ModalRenderer />
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
                            {isUsingProdDevtools ? (
                                <DevTools
                                    pillar={modifiedPillar}
                                    setPillar={setPillar}
                                    type={modifiedType}
                                    setType={setType}
                                />
                            ) : null}
                            <WithArticle
                                type={
                                    isUsingProdDevtools
                                        ? getEnumPosition(
                                              ArticleType,
                                              modifiedType,
                                          )
                                        : article.article.articleType ||
                                          ArticleType.Article
                                }
                                pillar={articlePillars[modifiedPillar]}
                            >
                                <ArticleController article={article.article} />
                            </WithArticle>
                        </>
                    ),
                })}
            </ScrollView>
        </>
    )
}

export { ArticleScreenBody }
