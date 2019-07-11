import React from 'react'
import { Text } from 'react-native'
import { UiExplainerCopy, UiBodyCopy } from 'src/components/styled-text'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'

export interface PropTypes {
    title: string
    icon?: string
    message?: string
    action?: [string, () => void]
}

const ErrorMessage = ({ icon, title, message, action }: PropTypes) => (
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
        {!!action && (
            <Button style={{ marginTop: metrics.vertical }} onPress={action[1]}>
                {action[0]}
            </Button>
        )}
    </>
)

export { ErrorMessage }
