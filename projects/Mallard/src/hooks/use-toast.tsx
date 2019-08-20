import React, { ReactElement, useState } from 'react'
import { ToastList, ToastProps, ToastRootHolder } from 'src/components/toast'
import {
    createGetterSetterProviderHook,
    getterSetterHook,
} from 'src/helpers/provider'

/*
  Exports
 */

const useToastInContext = () => {
    const [toast, setToast] = useState<ToastList>([])

    const removeLastToast = () => {
        setToast(toasts => toasts.slice(0, -1))
    }

    const showToast = (
        title: ToastProps['title'],
        moreThings: Omit<ToastProps, 'title'> = {},
    ) => {
        setToast(toasts => [...toasts, { title, ...moreThings }])
        setTimeout(() => {
            removeLastToast()
        }, 5000)
    }

    return getterSetterHook({
        getter: toast,
        setter: { showToast, removeLastToast },
    })
}

const {
    Provider: ToastProviderBase,
    useAsHook: useToast,
} = createGetterSetterProviderHook(useToastInContext)

const ToastProvider = ({ children }: { children: ReactElement }) => {
    return (
        <ToastProviderBase>
            {children}
            <ToastRootHolder />
        </ToastProviderBase>
    )
}

export { ToastProvider, useToast }
