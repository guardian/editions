import React from 'react'
import {
    Image,
    Modal,
    SafeAreaView,
    View,
    Text,
    Linking,
    Platform,
} from 'react-native'
import { useDeprecationModal } from 'src/hooks/use-deprecation-screen'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { TitlepieceText } from '../components/styled-text'
import { useNetInfo } from '../hooks/use-net-info'
import { defaultSettings } from 'src/helpers/settings/defaults'

const StoreLink = () => {
    const name = Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'
    const link =
        Platform.OS === 'ios'
            ? defaultSettings.storeDetails.ios
            : defaultSettings.storeDetails.android
    return (
        <Text
            style={{
                textDecorationLine: 'underline',
            }}
            onPress={() => Linking.openURL(link)}
        >
            {name}
        </Text>
    )
}

const DeprecateVersionModal = () => {
    const { isConnected } = useNetInfo()
    const { showModal } = useDeprecationModal()

    return (
        <Modal visible={isConnected && showModal}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: color.ui.sea,
                    justifyContent: 'flex-end',
                }}
            >
                <View
                    style={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        padding: 28,
                        maxWidth: 600,
                        alignSelf: 'center',
                    }}
                >
                    <TitlepieceText
                        accessibilityRole="header"
                        style={[
                            getFont('titlepiece', 2),
                            {
                                color: color.palette.neutral[100],
                                marginBottom: 30,
                            },
                        ]}
                    >
                        This version of the Daily app is no longer supported
                    </TitlepieceText>
                    <TitlepieceText
                        style={[
                            getFont('titlepiece', 1.5),
                            { color: color.primary },
                        ]}
                    >
                        Please go to the {StoreLink()} to update to the latest
                        version
                    </TitlepieceText>
                </View>

                <Image
                    source={require('../assets/images/guardian-observer.png')}
                    style={{
                        flex: 1,
                        width: '90%',
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        maxWidth: 600,
                    }}
                />
            </SafeAreaView>
        </Modal>
    )
}

export { DeprecateVersionModal }
