import React, { useRef, useEffect } from 'react'
import { StyleSheet, Share, Platform } from 'react-native'
import WebView from 'react-native-webview'
import { parsePing } from 'src/helpers/webview'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { WebviewWithArticle } from './article/webview'
import { Article as ArticleT, PictureArticle, GalleryArticle } from 'src/common'
import DeviceInfo from 'react-native-device-info'
import { PathToArticle } from 'src/paths'
import { NavigationScreenProp } from 'react-navigation'
import {
    IssueOrigin,
    BlockElement,
    ImageElement,
    CreditedImage,
} from '../../../../../Apps/common/src'
import { navigateToLightbox } from 'src/navigation/helpers/base'

const styles = StyleSheet.create({
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    webviewWrap: {
        ...StyleSheet.absoluteFillObject,
    },
    webview: {
        flex: 1,
        overflow: 'hidden',
        /*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        Bug is only in Android 9
        */
        opacity:
            DeviceInfo.getSystemVersion() === '9.0' && Platform.OS === 'android'
                ? 0.99
                : 1,
    },
})

export type HeaderControlInnerProps = {
    /**
     * Called when the user scrolled up or down sufficiently that we want to
     * auto-hide the article header (slider, navbar...), or show it again.
     */
    onShouldShowHeaderChange: (shouldShowHeader: boolean) => void
    /**
     * Whether the header is shown right now.
     */
    shouldShowHeader: boolean
    /**
     * A padding, in points/pixel, which should added at the very top of the
     * article so that it accomodates the header that will be shown with
     * absolute positionning on top of it.
     */
    topPadding: number
}

export type HeaderControlProps = HeaderControlInnerProps & {
    /**
     * Called when we changed from being at the top to being in the middle of
     * the article.
     */
    onIsAtTopChange: (isAtTop: boolean) => void
}
export const getLightboxImages = (elements: BlockElement[]): ImageElement[] => {
    const images: ImageElement[] = elements.filter(
        (e: BlockElement): e is ImageElement => e.id === 'image',
    )
    return images
}

export const getCreditedImages = (
    elements: ImageElement[],
): CreditedImage[] => {
    const creditedImages: CreditedImage[] = elements.map(e => {
        return {
            source: e.src.source,
            path: e.src.path,
            role: e.src.role,
            credit: e.credit,
            caption: e.caption,
            displayCredit: e.displayCredit,
        }
    })
    return creditedImages
}

/**
 * This takes care of updating the value of a global *within* the web
 * view. Since the API is imperative, we cannot pass this as a "prop" to the
 * JavaScript inside the webview. So instead we pass it imperatively when the
 * value changes. We try to minimize communication for perf. so we don't need to
 * do anything if the value changed because the webview itself communicated us a
 * change in the first place; it has the right value already.
 */
const useUpdateWebviewVariable = (
    webviewRef: React.MutableRefObject<WebView | null>,
    name: string,
    value: boolean,
) => {
    const valueInWebview = useRef(true)
    useEffect(() => {
        if (webviewRef.current == null) return
        if (value === valueInWebview.current) return
        valueInWebview.current = value
        webviewRef.current.injectJavaScript(`window.${name} = ${value};`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    return valueInWebview
}

const Article = ({
    navigation,
    article,
    path,
    onShouldShowHeaderChange,
    shouldShowHeader,
    topPadding,
    onIsAtTopChange,
    origin,
}: {
    navigation: NavigationScreenProp<{}>
    article: ArticleT | PictureArticle | GalleryArticle
    path: PathToArticle
    origin: IssueOrigin
} & HeaderControlProps) => {
    const [, { type }] = useArticle()
    const ref = useRef<WebView | null>(null)

    const wasShowingHeader = useUpdateWebviewVariable(
        ref,
        'shouldShowHeader',
        shouldShowHeader,
    )

    const [, { pillar }] = useArticle()

    return (
        <Fader>
            <WebviewWithArticle
                type={type}
                article={article}
                path={path}
                scrollEnabled={true}
                useWebKit={false}
                style={[styles.webview]}
                _ref={r => {
                    ref.current = r
                }}
                topPadding={topPadding}
                origin={origin}
                onMessage={event => {
                    const parsed = parsePing(event.nativeEvent.data)
                    if (parsed.type === 'share') {
                        if (article.webUrl == null) return
                        if (Platform.OS === 'ios') {
                            Share.share({
                                url: article.webUrl,
                                message: article.headline,
                            })
                        } else {
                            Share.share(
                                {
                                    title: article.headline,
                                    url: article.webUrl,
                                    // 'message' is required as well as 'url' to support wide range of clients (e.g. email/whatsapp etc)
                                    message: article.webUrl,
                                },
                                {
                                    subject: article.headline,
                                },
                            )
                        }
                        return
                    }
                    if (parsed.type === 'shouldShowHeaderChange') {
                        wasShowingHeader.current = parsed.shouldShowHeader
                        onShouldShowHeaderChange(parsed.shouldShowHeader)
                    }
                    if (parsed.type === 'isAtTopChange') {
                        onIsAtTopChange(parsed.isAtTop)
                    }
                    if (parsed.type === 'openLightbox') {
                        const lbimages = getLightboxImages(article.elements)
                        const lbCreditedImages = getCreditedImages(lbimages)
                        let index = parsed.index
                        // to avoid image duplication we don't add the main image of gallery articles to the array
                        if (article.type !== 'gallery' && article.image) {
                            lbCreditedImages.unshift(article.image)
                            if (parsed.isMainImage === 'false') {
                                index++
                            }
                        }
                        navigateToLightbox({
                            navigation,
                            navigationProps: {
                                images: lbCreditedImages,
                                index,
                                pillar,
                            },
                        })
                    }
                }}
            />
        </Fader>
    )
}

export { Article }
