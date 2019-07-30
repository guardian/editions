import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Button, ButtonAppearance } from './button/button'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { useAlphaIn } from 'src/hooks/use-alpha-in'

const modalStyles = StyleSheet.create({
    wrapper: {
        color: color.primary,
        backgroundColor: '#399fdc',
        padding: 20,
    },
    title: {
        marginBottom: 20,
        ...getFont('titlepiece', 1.5),
    },
    text: {
        marginBottom: 10,
        ...getFont('titlepiece', 1),
    },
    button: {
        marginTop: 10,
        marginRight: 10,
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

const ModalCard = ({
    title,
    text,
    actions,
    close,
}: ModalCardProps & { close: () => void }) => (
    <View style={modalStyles.wrapper}>
        <Text style={modalStyles.title}>{title}</Text>
        <Text style={modalStyles.text}>{text}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {actions.map(({ label, onPress }) => (
                <Button
                    style={modalStyles.button}
                    appearance={ButtonAppearance.light}
                    key={label}
                    onPress={() => {
                        close()
                        onPress()
                    }}
                >
                    {label}
                </Button>
            ))}
        </View>
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
    const val = useAlphaIn(200, { out: true, currentValue: state ? 0.75 : 0 })
    const close = useMemo(() => () => setState(null), [])

    return (
        <>
            <ModalContext.Provider value={{ open: setState, close }}>
                {children}
            </ModalContext.Provider>
            {state && (
                <>
                    <Animated.View
                        style={{
                            backgroundColor: 'black',
                            opacity: val,
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            elevation: 9999,
                            zIndex: 9999,
                        }}
                    ></Animated.View>
                    <Animated.View
                        style={{
                            alignItems: 'stretch',
                            padding: 10,
                            position: 'absolute',
                            justifyContent: 'center',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            flex: 1,
                            transform: [
                                {
                                    translateY: val.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0],
                                    }),
                                },
                            ],
                            flexDirection: 'column',
                            elevation: 9999,
                            zIndex: 9999,
                        }}
                    >
                        <ModalCard close={close} {...state} />
                    </Animated.View>
                </>
            )}
        </>
    )
}

export { Modal, ModalContext }
