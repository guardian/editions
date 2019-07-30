import React, { useState, useMemo } from 'react'
import { Animated } from 'react-native'
import { useAlphaIn } from 'src/hooks/use-alpha-in'

type ModalRenderer = (close: () => void) => React.ReactNode

const ModalContext = React.createContext<{
    open: (render: ModalRenderer) => void
    close: () => void
}>({
    open: () => {},
    close: () => {},
})

const Modal = ({ children }: { children: React.ReactNode }) => {
    const [render, setState] = useState<ModalRenderer | null>(null)
    const val = useAlphaIn(200, { out: true, currentValue: render ? 0.75 : 0 })
    const close = useMemo(() => () => setState(null), [])

    return (
        <>
            <ModalContext.Provider
                value={{
                    open: renderModal => setState(() => renderModal),
                    close,
                }}
            >
                {children}
            </ModalContext.Provider>
            {render && (
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
                        {render(close)}
                    </Animated.View>
                </>
            )}
        </>
    )
}

export { Modal, ModalContext }
