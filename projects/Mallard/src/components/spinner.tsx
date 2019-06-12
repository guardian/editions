import React from 'react'
import { Image } from 'react-native'

const Spinner = () => (
    <Image
        accessibilityLabel={'Loading content'}
        style={{ width: 90, height: 90 }}
        source={{
            uri: 'https://media.giphy.com/media/mTs11L9uuyGiI/giphy.gif',
        }}
    />
)

export { Spinner }
