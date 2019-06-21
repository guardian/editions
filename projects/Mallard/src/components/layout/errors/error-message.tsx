import React from 'react'
import { Text } from 'react-native'
import { UiExplainerCopy, UiBodyCopy } from 'src/components/styled-text'

export interface PropTypes {
    title: string
    icon?: string
    message?: string
}

const ErrorMessage = ({ icon, title, message }: PropTypes) => (
    <>
        {!!icon && <Text style={{ fontSize: 40 }}>{icon}</Text>}
        <UiBodyCopy weight="bold">{title}</UiBodyCopy>
        {!!message && (
            <UiExplainerCopy style={{ textAlign: 'center' }}>
                {message}
            </UiExplainerCopy>
        )}
    </>
)

export { ErrorMessage }
