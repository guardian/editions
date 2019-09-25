import React, { useState } from 'react'
import { Modal, SafeAreaView, View } from 'react-native'
import { useNetInfo } from '../hooks/use-net-info'
import { TitlepieceText } from '../components/styled-text'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import DeviceInfo from 'react-native-device-info'
import { useDeprecationModal } from 'src/hooks/use-deprecation-screen'

const content = {
    title: 'This version of the Daily app is no longer supported',
    subtitle:
        'Please go to the <INSERT STORE LINK> to update to the latest version',
}

const DeprecateVersionModal = () => {
    const { showModal } = useDeprecationModal()

    return (
        <Modal visible={showModal}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: color.ui.sea,
                    justifyContent: 'center',
                }}
            >
                <TitlepieceText
                    accessibilityRole="header"
                    style={[
                        getFont('titlepiece', 2),
                        { color: color.palette.neutral[100] },
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
                    Please go to the INSERT STORE LINK to update to the latest
                    version
                </TitlepieceText>
            </SafeAreaView>
        </Modal>
    )
}

export { DeprecateVersionModal }
