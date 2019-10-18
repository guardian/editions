import { Linking, Platform } from 'react-native'
import { EMBED_DOMAIN } from '../../html/article'

const urlIsNotAnEmbed = (url: string) =>
    !(
        url.startsWith(EMBED_DOMAIN) ||
        url.startsWith('https://www.youtube.com/embed')
    )

export const onShouldStartLoadWithRequest = (event: any) => {
    if (
        Platform.select({
            ios: event.navigationType === 'click',
            android: urlIsNotAnEmbed(event.url), // android doesn't have 'click' types so check for our embed types
        })
    ) {
        Linking.openURL(event.url)
        return false
    }
    return true
}
