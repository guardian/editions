import { Linking, Platform } from 'react-native'
import { EMBED_DOMAIN } from '../../html/components/media-atoms'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'

const urlIsNotAnEmbed = (url: string) =>
    !(
        url.startsWith(EMBED_DOMAIN) ||
        url.startsWith('https://www.youtube.com/embed')
    )

export const onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    if (
        Platform.select({
            ios: event.navigationType === 'click',
            android: urlIsNotAnEmbed(event.url), // android doesn't have 'click' types so check for our embed types
        })
    ) {
        // if a relative URL got clicked then, for now, ignore it
        if (!event.url.startsWith('file://')) {
            Linking.openURL(event.url)
        }
        return false
    }
    return true
}
