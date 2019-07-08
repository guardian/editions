import React from 'react'
import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import { Row, Separator, Heading, Footer } from 'src/components/layout/ui/row'
import { useSettings, useGdprSwitches } from 'src/hooks/use-settings'
import { container } from 'src/theme/styles'
import { GdprSwitchSettings } from 'src/helpers/settings'
import { ThreeWaySwitch } from 'src/components/layout/ui/switch'
import { Button } from 'src/components/button/button'

const styles = StyleSheet.create({
    container,
})

interface GdprSwitch {
    key: keyof GdprSwitchSettings
    name: string
    description: string
}

const GdprConsent = () => {
    const [{ isUsingProdDevtools, ...settings }, setSetting] = useSettings()
    const { DEVMODE_resetAll } = useGdprSwitches()
    const switches: { [key in keyof GdprSwitchSettings]: GdprSwitch } = {
        gdprAllowPerformance: {
            key: 'gdprAllowPerformance',
            name: 'Performance (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
        },
        gdprAllowTracking: {
            key: 'gdprAllowTracking',
            name: 'Tracking (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
        },
    }

    return (
        <View>
            <Heading>Your privacy</Heading>
            <FlatList
                ItemSeparatorComponent={Separator}
                ListFooterComponent={Separator}
                ListHeaderComponent={Separator}
                data={Object.values(switches)}
                keyExtractor={({ key }) => key}
                renderItem={({ item }) => (
                    <Row
                        title={item.name}
                        explainer={item.description}
                        onPress={() => {
                            setSetting(item.key, !settings[item.key])
                        }}
                        proxy={<ThreeWaySwitch value={settings[item.key]} />}
                    ></Row>
                )}
            />
            {isUsingProdDevtools ? (
                <Footer>
                    <Button onPress={DEVMODE_resetAll}>Reset</Button>
                </Footer>
            ) : null}
        </View>
    )
}

const GdprConsentScreen = () => (
    <ScrollView style={styles.container}>
        <GdprConsent></GdprConsent>
    </ScrollView>
)

export { GdprConsent, GdprConsentScreen }
