import moment from 'moment'
import React, { useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import { ImageResource } from 'src/components/front/image-resource'
import {
    Image,
    SpecialEditionButtonStyles,
} from '../../../../../Apps/common/src'
import { styles } from './styles'

const SpecialEditionButton = ({
    expiry,
    devUri,
    image,
    onPress,
    selected = false,
    subTitle,
    style,
    title,
}: {
    expiry: Date
    devUri?: string
    image: Image
    onPress: () => void
    selected?: boolean
    style: SpecialEditionButtonStyles
    subTitle: string
    title: string
}) => {
    const [pressed, setPressed] = useState(false)
    const defaultStyles = styles({ style, selected: selected || pressed })

    return (
        <TouchableWithoutFeedback
            accessibilityRole="button"
            accessibilityLabel={`${title} - Special Edition Button`}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={onPress}
        >
            <View style={defaultStyles.container}>
                <ImageResource
                    devUri={devUri}
                    image={image}
                    use="full-size"
                    style={defaultStyles.image}
                />
                <View style={defaultStyles.textBox}>
                    <Text style={defaultStyles.title}>{title}</Text>
                    <Text style={defaultStyles.subTitle}>{subTitle}</Text>
                    <Text style={defaultStyles.expiry}>
                        Available until{' '}
                        {moment(expiry)
                            .local()
                            .format('l')}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export { SpecialEditionButton }
