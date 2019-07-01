import React from 'react'
import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import { Row, Separator, Heading } from 'src/components/layout/ui/row'
import { useSettings } from 'src/hooks/use-settings'
import { container } from 'src/theme/styles'
import { GdprSwitchSettings, GdprSwitchSetting } from 'src/helpers/settings'
import { ThreeWaySwitch } from 'src/components/layout/ui/switch'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    container,
})

const gdprRelatedSwitches: (keyof GdprSwitchSettings)[] = [
    'gdprAllowPerformance',
    'gdprAllowTracking',
]

interface GdprSwitch {
    name: string
    description: string
    value: GdprSwitchSetting
    setter: (value: boolean) => void
}

export const useGdprSwitches = () => {
    const [settings, setSetting] = useSettings()

    const enableNulls = () => {
        gdprRelatedSwitches.map(sw => {
            if (settings[sw] === null) {
                setSetting(sw, true)
            }
        })
    }

    const resetAll = () => {
        gdprRelatedSwitches.map(sw => {
            setSetting(sw, null)
        })
    }

    return { enableNulls, resetAll }
}

const GdprConsent = () => {
    const [
        { gdprAllowPerformance, gdprAllowTracking, isUsingProdDevtools },
        setSetting,
    ] = useSettings()
    const { resetAll } = useGdprSwitches()
    const switches: GdprSwitch[] = [
        {
            name: 'Performance (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
            value: gdprAllowPerformance,
            setter: value => {
                setSetting('gdprAllowPerformance', value)
            },
        },
        {
            name: 'Tracking (NOT IN USE)',
            description: 'Basic tracking used to give you a better experience',
            value: gdprAllowTracking,
            setter: value => {
                setSetting('gdprAllowTracking', value)
            },
        },
    ]

    return (
        <View>
            <Heading>Your privacy</Heading>
            <FlatList
                ItemSeparatorComponent={Separator}
                ListFooterComponent={Separator}
                ListHeaderComponent={Separator}
                data={switches}
                keyExtractor={item => item.description + item.name}
                renderItem={({ item }) => (
                    <Row
                        title={item.name}
                        explainer={item.description}
                        proxy={
                            <ThreeWaySwitch
                                value={item.value}
                                onValueChange={() => {
                                    item.setter(!item.value)
                                }}
                            />
                        }
                    ></Row>
                )}
            />
            {isUsingProdDevtools ? (
                <View
                    style={{
                        padding: metrics.horizontal,
                        paddingVertical: metrics.vertical,
                    }}
                >
                    <Button onPress={resetAll}>Reset</Button>
                </View>
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
