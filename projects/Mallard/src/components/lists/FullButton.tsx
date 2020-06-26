import React from 'react'
import { Highlight } from '../highlight'
import { RightChevron } from '../icons/RightChevron'
import { UiBodyCopy } from '../styled-text'
import { styles } from './styles'

const FullButton = ({
    onPress,
    text,
}: {
    onPress: () => void
    text: string
}) => (
    <Highlight style={styles.button} onPress={onPress}>
        <UiBodyCopy weight="bold">{text}</UiBodyCopy>
        <RightChevron />
    </Highlight>
)

export { FullButton }
