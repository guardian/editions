import React from 'react'
import { Clipboard, TouchableOpacity } from 'react-native'
import { Button } from 'src/components/button/button'
import { UiBodyCopy, UiExplainerCopy } from 'src/components/styled-text'
import { GENERIC_ERROR } from 'src/helpers/words'
import { useSettingsValue } from 'src/hooks/use-settings'
import { metrics } from 'src/theme/spacing'

export interface PropTypes {
    title?: string
    message?: string
    debugMessage?: string
    action?: [string, () => void]
}

const ErrorMessage = ({ title, message, debugMessage, action }: PropTypes) => {
    const { isUsingProdDevtools } = useSettingsValue()

    return (
        <>
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
