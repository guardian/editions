import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'

const wrapperStyles = StyleSheet.create({
    inner: { height: metrics.frontsPageHeight },
})

const Wrapper = ({
    children,
    scrubber,
}: {
    scrubber: ReactElement
    children: ReactElement
}) => {
    return (
        <>
            <View
                style={{
                    padding: metrics.horizontal,
                    marginBottom: 0,
                    marginTop: metrics.vertical * 2,
                }}
            >
                {scrubber}
            </View>
            <View style={wrapperStyles.inner}>{children}</View>
        </>
    )
}

export { Wrapper }
