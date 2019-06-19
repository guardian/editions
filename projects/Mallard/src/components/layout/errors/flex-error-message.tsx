import React from 'react'
import { ViewStyle, StyleProp } from 'react-native'
import { PropTypes, ErrorMessage } from './error-message'
import { FlexCenter } from '../flex-center'

const FlexErrorMessage = ({
    style,
    ...props
}: { style?: StyleProp<ViewStyle> } & PropTypes) => (
    <FlexCenter {...{ style }}>
        <ErrorMessage {...props} />
    </FlexCenter>
)

export { FlexErrorMessage }
