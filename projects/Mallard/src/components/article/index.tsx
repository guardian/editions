import React from 'react'
import { CAPIArticle } from 'src/common'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { color } from 'src/theme/color'
import { Article as OldArticle } from './types/article'
import { Article } from './types/article-new'
import { Crossword } from './types/crossword'
import { Gallery } from './types/gallery'
import { Cartoon } from './types/cartoon'

import { ScrollView } from 'react-native'
import {
    OnTopPositionChangeFn,
    wireScrollBarToDismiss,
} from 'src/screens/article/helpers'
import { useOtherSettingsValues } from 'src/hooks/use-settings'

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

export interface ArticleControllerPropTypes {
    article: CAPIArticle
}

const ArticleController = ({
    article,
    onTopPositionChange,
}: {
    article: CAPIArticle
    onTopPositionChange: OnTopPositionChangeFn
}) => {
    const { useNewWebview } = useOtherSettingsValues()
    switch (article.type) {
        case 'article':
            console.log(article)
            return useNewWebview ? (
                <Article
                    onTopPositionChange={onTopPositionChange}
                    article={article.elements}
                    {...article}
                />
            ) : (
                <OldArticle
                    onTopPositionChange={onTopPositionChange}
                    article={article.elements}
                    {...article}
                ></OldArticle>
            )

        case 'gallery':
            return (
                <ScrollView {...wireScrollBarToDismiss(onTopPositionChange)}>
                    <Gallery gallery={article} />
                </ScrollView>
            )

        case 'picture':
            return (
                <ScrollView {...wireScrollBarToDismiss(onTopPositionChange)}>
                    <Cartoon article={article} />
                </ScrollView>
            )

        case 'crossword':
            return <Crossword crosswordArticle={article} />

        default:
            const message: never = article
            return (
                <FlexErrorMessage
                    title={message}
                    style={{ backgroundColor: color.background }}
                />
            )
    }
}

export { ArticleController }
