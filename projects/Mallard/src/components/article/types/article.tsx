import React, { useRef, useEffect, useState } from 'react'
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
import { selectImagePath } from 'src/hooks/use-image-paths'
import { useApiUrl } from 'src/hooks/use-settings'
import { useIssueSummary } from 'src/hooks/use-issue-summary'
import { Image } from 'src/common'
import { remoteConfigService } from 'src/services/remote-config'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { isSuccessOrRedirect } from './article/helpers'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useIsAppsRendering } from 'src/hooks/use-config-provider'

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

const injectJavascript = (
    webviewRef: React.MutableRefObject<WebView | null>,
    script: string,
): void => {
    if (webviewRef && webviewRef.current) {
        webviewRef.current.injectJavaScript(script)
    }
}

/**
 * Sometimes the webUrl is empty due to that content not being published at the point the edition
 * was created. However, we still have access to the article path at the time of publication
 * This function checks to see if theguardian.com/<path at publication time> exists
 */
const checkPathExists = async (articlePath: string) => {
    const generatedUrl = `${defaultSettings.websiteUrl}${articlePath}`
    // HEAD request as we only need the status code. If the request fails return null
    const dotComResult = await fetch(`${generatedUrl}`, {
        method: 'HEAD',
    }).catch(() => null)

    return dotComResult && isSuccessOrRedirect(dotComResult.status)
        ? generatedUrl
        : null
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
    const [imagePaths, setImagePaths] = useState([''])
    const [lightboxImages, setLightboxImages] = useState<CreditedImage[]>()

    const wasShowingHeader = useUpdateWebviewVariable(
        ref,
        'shouldShowHeader',
        shouldShowHeader,
    )
    const lightboxEnabled = remoteConfigService.getBoolean('lightbox_enabled')

    const [, { pillar }] = useArticle()
    const apiUrl = useApiUrl() || ''
    const { issueId } = useIssueSummary()

    // if webUrl is undefined then we attempt to fetch a url to use for sharing
    const [shareUrl, setShareUrl] = useState(article.webUrl)
    // we can only attempt to fetch the url if connected
    const client = useApolloClient()
    const data = client.readQuery<{ netInfo: { isConnected: boolean } }>({
        query: gql('{ netInfo @client { isConnected @client } }'),
    })
    const isConnected = data && data.netInfo.isConnected
    const shareUrlFetchEnabled =
        !article.webUrl &&
        isConnected &&
        // TODO: remove remote switch once we are happy this feature is stable
        remoteConfigService.getBoolean('generate_share_url')

    useEffect(() => {
        const lbimages = getLightboxImages(article.elements)
        const lbCreditedImages = getCreditedImages(lbimages)
        // to avoid image duplication we don't add the main image of gallery articles to the array
        if (article.type !== 'gallery' && article.image) {
            lbCreditedImages.unshift(article.image)
        }
        setLightboxImages(lbCreditedImages)
        const getImagePathFromImage = async (image: Image) => {
            if (issueId && image) {
                const { localIssueId, publishedIssueId } = issueId
                const imagePath = await selectImagePath(
                    apiUrl,
                    localIssueId,
                    publishedIssueId,
                    image,
                    'full-size',
                )
                return imagePath
            }
            return ''
        }
        const fetchImagePaths = async () => {
            return await Promise.all(
                lbCreditedImages.map(image => getImagePathFromImage(image)),
            )
        }
        fetchImagePaths().then(imagePaths => setImagePaths(imagePaths))

        const updateShareUrl = async () => {
            const url = await checkPathExists(article.key)
            if (url) {
                injectJavascript(
                    ref,
                    `document.getElementById('share-button').classList.remove('display-none');
                     document.getElementById('byline-area').classList.remove('display-none');
                    `,
                )
                setShareUrl(url)
            }
        }

        shareUrlFetchEnabled && updateShareUrl()
    }, [
        apiUrl,
        article.elements,
        issueId,
        article.image,
        article.type,
        article.key,
        shareUrlFetchEnabled,
    ])
    const {isAppsRendering} = useIsAppsRendering()

    return (
        <Fader>
            <WebviewWithArticle
                type={type}
                article={article}
                path={path}
                scrollEnabled={true}
                useWebKit={false}
                allowsInlineMediaPlayback={true} // need this along with `mediaPlaybackRequiresUserAction = false` to ensure videos in twitter embeds play on iOS
                mediaPlaybackRequiresUserAction={false}
                style={[styles.webview, , isAppsRendering ? {marginTop: 40} : null]}
                _ref={r => {
                    ref.current = r
                }}
                topPadding={topPadding}
                origin={origin}
                onMessage={event => {
                    const parsed = parsePing(event.nativeEvent.data)
                    if (parsed.type === 'share' && shareUrl) {
                        if (Platform.OS === 'ios') {
                            Share.share({
                                url: shareUrl,
                                message: article.headline,
                            })
                        } else {
                            Share.share(
                                {
                                    title: article.headline,
                                    url: shareUrl,
                                    // 'message' is required as well as 'url' to support wide range of clients (e.g. email/whatsapp etc)
                                    message: shareUrl,
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
                    if (lightboxEnabled && parsed.type === 'openLightbox') {
                        let index = parsed.index
                        if (
                            article.type !== 'gallery' &&
                            article.image &&
                            parsed.isMainImage === 'false' &&
                            lightboxImages &&
                            lightboxImages.length > 1
                        ) {
                            index++
                        }
                        navigateToLightbox({
                            navigation,
                            navigationProps: {
                                images: lightboxImages,
                                imagePaths: imagePaths,
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
