import React, { useState, useMemo, useContext, useCallback } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useAlphaIn } from 'src/hooks/use-alpha-in'

type ModalRenderer = (close: () => void) => React.ReactNode

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 9999,
        zIndex: 9999,
    },
    modalWrapper: {
        alignItems: 'center',
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
    },
})

interface ModalContextValue {
    open: (render: ModalRenderer) => void
    close: () => void
    isOpen: boolean
}

const ModalContext = React.createContext<ModalContextValue>({
    open: () => {},
    close: () => {},
    isOpen: false,
})

const useModal = () => useContext(ModalContext)

const Modal = ({ children }: { children: React.ReactNode }) => {
    const [render, setState] = useState<ModalRenderer | null>(null)
    const val = useAlphaIn(200, { out: true, currentValue: render ? 0.75 : 0 })
    const close = useMemo(() => () => setState(null), [])

    const open = useCallback(renderModal => setState(() => renderModal), [])

    const value = useMemo(
        (): ModalContextValue => ({
            open,
            close,
            isOpen: !!render,
        }),
        [open, close, render],
    )

    return (
        <>
            <ModalContext.Provider value={value}>
                {children}
            </ModalContext.Provider>
            {render && (
                <>
                    <Animated.View
                        style={[
                            styles.overlay,
                            {
                                opacity: val,
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.modalWrapper,
                            {
                                transform: [
                                    {
                                        translateY: val.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {render(close)}
                    </Animated.View>
                </>
            )}
        </>
    )
}

export { Modal, useModal }
