import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from './button/button'
import { getFont } from 'src/theme/typography'

const modalStyles = StyleSheet.create({
    wrapper: {
        color: 'white',
        backgroundColor: 'blue',
        padding: 10,
    },
    title: {
        color: 'white',
        ...getFont('text', 1),
    },
    text: {
        color: 'white',
        ...getFont('text', 1),
    },
})

interface Action {
    label: string
    onPress: () => void
}

export interface ModalCardProps {
    title: string
    text: string
    actions: Action[]
}

const ModalCard = ({ title, text, actions }: ModalCardProps) => (
    <View style={modalStyles.wrapper}>
        <Text style={modalStyles.title}>{title}</Text>
        <Text style={modalStyles.text}>{text}</Text>
        {actions.map(({ label, onPress }) => (
            <Button key={label} onPress={onPress}>
                {label}
            </Button>
        ))}
    </View>
)

const ModalContext = React.createContext<{
    open: (data: ModalCardProps) => void
    close: () => void
}>({
    open: () => {},
    close: () => {},
})

const Modal = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<ModalCardProps | null>(null)

    return (
        <>
            <ModalContext.Provider
                value={{ open: setState, close: () => setState(null) }}
            >
                {children}
            </ModalContext.Provider>
            {state && (
                <View
                    style={{
                        alignItems: 'stretch',
                        backgroundColor: '#00000066',
                        padding: 10,
                        position: 'absolute',
                        justifyContent: 'center',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flex: 1,
                        flexDirection: 'column',
                        elevation: 9999,
                        zIndex: 9999,
                    }}
                >
                    <ModalCard {...state} />
                </View>
            )}
        </>
    )
}

export { Modal, ModalContext }
