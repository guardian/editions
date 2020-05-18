import React from 'react'
import { Text, View } from 'react-native'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, color } from '@storybook/addon-knobs'
import { Quote } from './Quote'
import { RightChevron } from './RightChevron'

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    icon: {
        padding: 20,
        borderBottomColor: '#333333',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    label: {
        paddingLeft: 20,
    },
})

storiesOf('Icons', module)
    .addDecorator(withKnobs)
    .add('All Icons', () => (
        <>
            <View style={styles.icon}>
                <Quote fill={color('Colour', '#000000')} />
                <Text style={styles.label}>Quote</Text>
            </View>
            <View style={styles.icon}>
                <RightChevron />
                <Text style={styles.label}>RightChevron</Text>
            </View>
        </>
    ))
