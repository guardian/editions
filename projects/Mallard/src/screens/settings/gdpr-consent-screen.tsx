import React from 'react'
import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import {
    Row,
    Separator,
    Heading,
    Footer,
    TallRow,
} from 'src/components/layout/ui/row'
import { useSettings, useGdprSwitches } from 'src/hooks/use-settings'
import { GdprSwitchSettings } from 'src/helpers/settings'
import { ThreeWaySwitch } from 'src/components/layout/ui/switch'
import { Button } from 'src/components/button/button'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { WithAppAppearance } from 'src/theme/appearance'

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
                    <TallRow
                        title={item.name}
                        explainer={item.description}
                        proxy={
                            <ThreeWaySwitch
                                onValueChange={value =>
                                    setSetting(item.key, value)
                                }
                                value={settings[item.key]}
                            />
                        }
                    ></TallRow>
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
    <WithAppAppearance value={'settings'}>
        <ScrollContainer>
            <GdprConsent></GdprConsent>
        </ScrollContainer>
    </WithAppAppearance>
)

export { GdprConsent, GdprConsentScreen }
