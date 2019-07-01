import React from 'react'
import { View, Text } from 'react-native'
import { Row } from 'src/components/layout/list/row'
import { Switch } from 'react-native-gesture-handler'
import { useSettings } from 'src/hooks/use-settings'

const GdprConsent = () => {
    const [settings, setSetting] = useSettings()
    const { gdprAllowGoogleAnalytics } = settings

    return (
        <View>
            <Text>heyyy</Text>
            <Row
                title="Allow Google to see my stuff"
                proxy={
                    <Switch
                        value={gdprAllowGoogleAnalytics}
                        onValueChange={() => {
                            setSetting(
                                'gdprAllowGoogleAnalytics',
                                !gdprAllowGoogleAnalytics,
                            )
                        }}
                    />
                }
            ></Row>
        </View>
    )
}

export { GdprConsent }
