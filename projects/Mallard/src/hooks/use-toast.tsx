import React, { useState } from 'react'
import { Toast } from 'src/components/toast'
import {
    createGetterSetterProviderHook,
    getterSetterHook,
} from 'src/helpers/provider'
import { Button } from 'src/components/button/button'

/*
  Exports
 */
type Toast = string
type ToastList = Toast[]

const useToastInContext = () => {
    const [toast, setToast] = useState<ToastList>([])
    const addToast = (name: Toast) => {
        setToast(toasts => [...toasts, name])
        setTimeout(() => {
            setToast(toasts => toasts.slice(1))
        }, 2000)
    }

    return getterSetterHook({
        getter: toast,
        setter: { addToast },
    })
}

const {
    Provider: ToastProviderBase,
    useAsHook: useToast,
} = createGetterSetterProviderHook(useToastInContext)

const ToastRenderer = () => {
    const [toasts, { addToast }] = useToast()

    return (
        <>
            <Button
                onPress={() => {
                    addToast('hiiii ' + Date.now())
                }}
            >
                Add toast
            </Button>

            {toasts.map((toast, i) => (
                <Toast key={i + toast}>{toast}</Toast>
            ))}
        </>
    )
}

const ToastProvider = ({ children }) => {
    return (
        <ToastProviderBase>
            {children}
            <ToastRenderer />
        </ToastProviderBase>
    )
}

export { ToastProvider }
