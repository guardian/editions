import React from 'react'
import { View } from 'react-native'
import { Button, ButtonAppearance } from './Button'
import { useInsets } from 'src/hooks/use-screen'
export const ReloadButton: React.FC<{
    onPress: () => void
}> = ({ onPress }) => {
    const { top, left } = useInsets()
    return (
        <View
            style={[
                {
                    position: 'absolute',
                    top: top + 20,
                    left: left + 20,
                    zIndex: 99999,
                },
            ]}
        >
            <Button
                appearance={ButtonAppearance.tomato}
                onPress={onPress}
                buttonStyles={{ left: 0 }}
            >
                Reload
            </Button>
        </View>
    )
}
