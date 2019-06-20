import React from 'react'
import { Text } from 'react-native'

const Spinner = () => (
    <Text accessibilityLabel={'Loading content'} style={{ fontSize: 40 }}>
        ⏰
    </Text>
)

export { Spinner }
