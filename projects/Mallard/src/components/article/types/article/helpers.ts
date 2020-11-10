import { Linking, Platform } from 'react-native'

export const EMBED_DOMAIN = 'https://embed.theguardian.com'

const urlIsNotAnEmbed = (url: string) =>
    !(
        url.startsWith(EMBED_DOMAIN) ||
        url.startsWith('https://www.youtube.com/embed')
    )

// @TODO: Question whether this is needed in a post Apps Rendering world...
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

export const isSuccessOrRedirect = (status: number) =>
    [302, 200].includes(status)
