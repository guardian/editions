import React from 'react'
import { Image, ScrollView, Button, StyleSheet, Text, View } from 'react-native'
import { List } from '../components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { primaryContainer } from '../theme/styles'
import { ApiState } from './settings/api-screen'
import { WithAppAppearance } from '../theme/appearance'
import { metrics } from '../theme/spacing'

const styles = StyleSheet.create({
    container: primaryContainer,
    welcomeImage: {
        width: 1024 / 8,
        height: 559 / 8,
        resizeMode: 'contain',
    },
    getStartedContainer: {
        alignItems: 'flex-start',
        marginHorizontal: metrics.horizontal,
        marginVertical: metrics.vertical,
        marginTop: metrics.vertical * 2,
    },
})

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    return (
        <WithAppAppearance value={'primary'}>
            <ScrollView style={styles.container}>
                <View style={styles.getStartedContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.welcomeImage}
                    />
                </View>
                <List
                    data={[
                        {
                            key: 'sunday-30',
                            title: 'Sunday 30',
                            data: {
                                issue: 'sunday-30',
                            },
                        },
                        {
                            key: 'monday-1',
                            title: 'Monday 1',
                            data: {
                                issue: 'monday-1',
                            },
                        },
                    ]}
                    onPress={item => navigation.navigate('Front', item)}
                />
                <ApiState />
            </ScrollView>
        </WithAppAppearance>
    )
}

HomeScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: 'Mallard',
    headerRight: (
        <Button
            onPress={() => {
                navigation.navigate('Settings')
            }}
            title="Settings"
        />
    ),
})
