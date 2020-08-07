import React from 'react'
import { View } from 'react-native'
import { color } from 'src/theme/color'

const ItemSeperator = () => (
    <View
        style={{
            backgroundColor: color.palette.neutral[7],
            height: 1,
        }}
    ></View>
)

export { ItemSeperator }
