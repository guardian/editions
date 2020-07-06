import React from 'react'
import { Highlight } from '../highlight'
import { RightChevron } from '../icons/RightChevron'
import { UiBodyCopy } from '../styled-text'
import { styles } from './styles'
import { AccessibilityRole } from 'react-native'

const FullButton = ({
    onPress,
    text,
    accessible = true,
    accessibilityRole = 'none',
}: {
    onPress: () => void
    text: string
    accessible: boolean
    accessibilityRole: AccessibilityRole
}) => (
    <Highlight
        style={styles.button}
        onPress={onPress}
        accessible={accessible}
        accessibilityRole={accessibilityRole}
    >
        <UiBodyCopy weight="bold">{text}</UiBodyCopy>
        <RightChevron />
    </Highlight>
)

export { FullButton }
