import React from 'react'
import { FlatList, View } from 'react-native'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Footer, Separator, TallRow } from 'src/components/layout/ui/row'
import { ThreeWaySwitch } from 'src/components/layout/ui/switch'
import { Link } from 'src/components/link'
import { UiBodyCopy } from 'src/components/styled-text'
import { GdprSwitchSettings } from 'src/helpers/settings'
import { COOKIE_LINK, PRIVACY_LINK } from 'src/helpers/words'
import {
    useGdprSwitches,
    useSettings,
    useOtherSettingsValues,
    useSettingsValue,
} from 'src/hooks/use-settings'
import { WithAppAppearance } from 'src/theme/appearance'

interface GdprSwitch {
    key: keyof GdprSwitchSettings
    name: string
    services: string
    description: string
}
type EssentialGdprSwitch = Omit<GdprSwitch, 'key'>

const essentials: EssentialGdprSwitch = {
    name: 'Essential',
    services: 'Ophan - Braze - YouTube Player',
    description:
        'These are essential to provide you with services that you have requested. For example, this includes supporting the ability for you to watch videos and see service-related messages.',
}

const GdprConsent = () => {
    const setSetting = useSettings()
    const settings = useOtherSettingsValues()
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()

    const { DEVMODE_resetAll } = useGdprSwitches()
    const switches: { [key in keyof GdprSwitchSettings]: GdprSwitch } = {
        gdprAllowPerformance: {
            key: 'gdprAllowPerformance',
            name: 'Performance (NOT IN USE)',
            services: 'Google Analytics - Fabric - Nielsen - ComScore - Sentry',
            description:
                'Enabling these allows us to measure how you use our services. We use this information to get a better sense of how our users engage with our journalism and to improve our services, so that users have a better experience. For example, we collect information about which of our pages are most frequently visited, and by which types of users. If you disable this, we will not be able to measure your use of our services, and we will have less information about their performance.',
        },
        gdprAllowFunctionality: {
            key: 'gdprAllowFunctionality',
            name: 'Functionality (NOT IN USE)',
            services: 'Google - Facebook - Branch',
            description:
                'Enabling these allow us to provide you with a range of functionality and store related information. For example, you can use social media credentials such as your Google account to log into your Guardian account. If you disable this, some features of our services may not function.',
        },
    }

    return (
        <View>
            <TallRow
                title={''}
                explainer={
                    <>
                        Below you can manage your privacy settings for cookies
                        and similar technologies for this service. These
                        technologies are provided by us and by our third-party
                        partners. To find out more, read our{' '}
                        <Link href={PRIVACY_LINK}>privacy policy</Link> and{' '}
                        <Link href={COOKIE_LINK}>cookie policy</Link>. If you
                        disable a category, you may need to restart the app for
                        your changes to fully take effect.
                    </>
                }
                proxy={
                    <Button
                        appearance={ButtonAppearance.skeleton}
                        onPress={() => {
                            for (const { key } of Object.values(switches)) {
                                setSetting(key, true)
                            }
                        }}
                    >
                        Enable all
                    </Button>
                }
            ></TallRow>
            <Separator></Separator>
            <TallRow
                title={essentials.name + '\n' + essentials.services}
                explainer={essentials.description}
            ></TallRow>

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
            <Footer>
                <UiBodyCopy>
                    You can change the above setting any time by selecting
                    privacy settings in the settings menu
                </UiBodyCopy>
            </Footer>
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

GdprConsentScreen.navigationOptions = {
    title: 'Privacy Settings',
}

export { GdprConsent, GdprConsentScreen }
