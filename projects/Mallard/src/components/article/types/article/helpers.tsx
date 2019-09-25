import { Linking, Platform } from 'react-native'
import { ArticleFeatures } from 'src/common'
import { EMBED_DOMAIN } from '../../html/render'

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

//TODO: get this from backend
export const features: ArticleFeatures[] = [ArticleFeatures.HasDropCap]
