import React, { ReactElement, useState, ReactNode, useMemo } from 'react'
import {
    ToastList,
    ToastProps,
    ToastRootHolder,
} from 'src/components/toast/toast'
import { createProviderFromHook, providerHook } from 'src/helpers/provider'

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

    return providerHook({
        getter: toast,
        setter: { showToast, removeLastToast },
    })
}

const {
    Provider: ToastProviderBase,
    useAsGetterHook: useToastList,
    useAsSetterHook: useToast,
} = createProviderFromHook(useToastInContext)

const ToastProvider = ({ children }: { children: ReactNode }) => (
    <ToastProviderBase>
        {children}
        <ToastRootHolder />
    </ToastProviderBase>
)

export { ToastProvider, useToast, useToastList }
