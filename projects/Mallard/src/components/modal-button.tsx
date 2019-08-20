import React from 'react'
import { Button, ButtonAppearance } from './button/button'

const ModalButton = (props: {
    onPress: () => void
    children: string
    alt?: string
}) => (
    <Button
        {...props}
        alt={props.alt || props.children}
        style={{
            marginTop: 10,
            marginRight: 10,
        }}
        appearance={ButtonAppearance.light}
    />
)

export { ModalButton }
