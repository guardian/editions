import React from 'react'
import { Text, Clipboard } from 'react-native'
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
            <UiBodyCopy weight="bold" style={{ textAlign: 'center' }}>
                {title}
            </UiBodyCopy>
            {!!message && (
                <UiExplainerCopy style={{ textAlign: 'center' }}>
                    {message}
                </UiExplainerCopy>
            )}
            {isUsingProdDevtools && debugMessage ? (
                <>
                    <UiExplainerCopy style={{ textAlign: 'center' }}>
                        {debugMessage}
                    </UiExplainerCopy>
                    <Button
                        style={{ marginTop: metrics.vertical }}
                        onPress={() => {
                            Clipboard.setString(debugMessage)
                        }}
                    >
                        Copy
                    </Button>
                </>
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
