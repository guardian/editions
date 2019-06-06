import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Multiline } from '../multiline'
import { metrics } from '../../theme/spacing'

const unitStyles = StyleSheet.create({
    root: {
        padding: metrics.horizontal / 2,
        paddingVertical: metrics.vertical / 2,
    },
})
const Unit = ({ style }: {}) => {
    return (
        <View style={[unitStyles.root, style]}>
            <Text>Title</Text>
            <Text>Standfirst</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        height: 500,
        backgroundColor: 'white',
        alignItems: 'stretch',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        margin: metrics.horizontal,
        marginVertical: metrics.vertical,
    },
    row: {
        flexBasis: 0,
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
})

const StoryCard = ({ length }) => {
    if (length === 2) {
        return (
            <View style={styles.root}>
                <View style={styles.row}>
                    <Unit />
                    <Multiline count={2} />
                </View>
                <View style={styles.row}>
                    <Unit />
                </View>
            </View>
        )
    }
    if (length === 3) {
        return (
            <View style={styles.root}>
                <View style={styles.row}>
                    <Unit />
                    <Multiline count={2} />
                </View>
                <View style={styles.row}>
                    <Unit />
                    <Multiline count={2} />
                </View>
                <View style={styles.row}>
                    <Unit />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <View style={styles.row}>
                <Unit />
                <Multiline count={2} />
            </View>
            <View style={styles.row}>
                <Unit />
                <Multiline count={2} />
            </View>
            <View style={styles.row}>
                <Unit />
                <Multiline count={2} />
            </View>
            <View style={styles.row}>
                <Unit />
            </View>
        </View>
    )
}

export default StoryCard
