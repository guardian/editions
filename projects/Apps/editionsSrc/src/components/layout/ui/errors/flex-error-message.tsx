import React from 'react'
import { ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { PropTypes, ErrorMessage } from './error-message'
import { FlexCenter } from '../../flex-center'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    main: {
        paddingHorizontal: metrics.horizontal,
    },
})

const FlexErrorMessage = ({
    style,
    ...props
}: { style?: StyleProp<ViewStyle> } & PropTypes) => (
    <FlexCenter style={[style, styles.main]}>
        <ErrorMessage {...props} />
    </FlexCenter>
)

export { FlexErrorMessage }
