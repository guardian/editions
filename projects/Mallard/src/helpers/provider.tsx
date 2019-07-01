import React, { createContext, useContext } from 'react'

const createProviderHook = <T extends {}>(hook: () => T | null) => {
    const Context = createContext<T | null>(null)
    const Provider = ({ children }: { children: React.ReactNode }) => {
        const value = hook()
        return (
            // @TODO: do we need to render a loading state here, it's so quick that we probably don't?
            value && (
                <Context.Provider value={value}>{children}</Context.Provider>
            )
        )
    }

    const useAsHook = (): T => {
        const ctx = useContext(Context)
        if (!ctx) {
            throw 'Missing context provider'
        }
        return ctx
    }

    return { Provider, useAsHook, Context }
}

export { createProviderHook }
