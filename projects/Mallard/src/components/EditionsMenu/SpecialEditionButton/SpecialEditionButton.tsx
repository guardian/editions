import moment from 'moment'
import React, { useState } from 'react'
import { Text, TouchableWithoutFeedback, View, Image } from 'react-native'
import { SpecialEditionButtonStyles } from '../../../../../Apps/common/src'
import { styles } from './styles'

const SpecialEditionButton = ({
    expiry,
    imageUri,
    onPress,
    selected = false,
    subTitle,
    style,
    title,
}: {
    expiry: Date
    imageUri?: string
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
                {imageUri ? (
                    <Image
                        key={imageUri}
                        resizeMethod={'resize'}
                        style={defaultStyles.image}
                        source={{ uri: imageUri }}
                    />
                ) : (
                    <View style={defaultStyles.image}></View>
                )}
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
