import React from 'react'
import { Text, Clipboard, TouchableOpacity } from 'react-native'
import { UiExplainerCopy, UiBodyCopy } from 'src/components/styled-text'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { GENERIC_ERROR } from 'src/helpers/words'
import { useSettings } from 'src/hooks/use-settings'

export interface PropTypes {
    title?: string
    icon?: string
    message?: string
    debugMessage?: string
    action?: [string, () => void]
}

const ErrorMessage = ({
    icon,
    title,
    message,
    debugMessage,
    action,
}: PropTypes) => {
    const [{ isUsingProdDevtools }] = useSettings()

    return (
        <>
            {!!icon && <Text style={{ fontSize: 40 }}>{icon}</Text>}
            {!!title && (
                <UiBodyCopy weight="bold" style={{ textAlign: 'center' }}>
                    {title}
                </UiBodyCopy>
            )}
            {!!message && (
                <UiExplainerCopy style={{ textAlign: 'center' }}>
                    {message}
                </UiExplainerCopy>
            )}
            {isUsingProdDevtools && debugMessage ? (
                <TouchableOpacity
                    onPress={() => {
                        Clipboard.setString(debugMessage)
                    }}
                >
                    <UiExplainerCopy style={{ textAlign: 'center' }}>
                        {debugMessage}
                    </UiExplainerCopy>
                </TouchableOpacity>
            ) : null}
            {!!action && (
                <Button
                    style={{ marginTop: metrics.vertical }}
                    onPress={action[1]}
                >
                    {action[0]}
                </Button>
            )}
        </>
    )
}
ErrorMessage.defaultProps = {
    title: GENERIC_ERROR,
}

export { ErrorMessage }
