import React from 'react'
import { Image, ScrollView, Button, StyleSheet, Text, View } from 'react-native'
import { List } from '../components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { container } from '../theme/styles'
import { ApiState } from './settings/api-screen'

const styles = StyleSheet.create({
    container,
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
        marginVertical: 7,
        padding: 16,
    },
})

export const HomeScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.getStartedContainer}>
                    <Image
                        source={require('../assets/images/roundel-192x192.png')}
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
                    onPress={item => navigation.navigate('Issue', item)}
                />
                <ApiState />
            </ScrollView>
        </View>
    )
}

HomeScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: 'Home',
    headerRight: (
        <Button
            onPress={() => {
                navigation.navigate('Settings')
            }}
            title="Settings"
        />
    ),
})
