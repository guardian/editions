import React, { createContext, useContext } from 'react'

export type GetterSetterHook<G, S> = null | {
    getter: G
    setter: S
}

export const getterSetterHook = <G, S>({
    getter,
    setter,
}: {
    getter: G
    setter: S
}) => ({ getter, setter })

const useContextAsHook = <C extends unknown>(
    Context: React.Context<C | null>,
): C => {
    const ctx = useContext(Context)
    if (!ctx) {
        throw 'Missing context provider'
    }
    return ctx
}

const createGetterSetterProviderHook = <G, S>(
    hook: () => GetterSetterHook<G, S>,
) => {
    const [GetterCtx, SetterCtx] = [
        createContext<G | null>(null),
        createContext<S | null>(null),
    ]
    const Provider = ({ children }: { children: React.ReactNode }) => {
        const hookVal = hook()
        if (hookVal) {
            const { getter, setter } = hookVal
            return (
                <GetterCtx.Provider value={getter}>
                    <SetterCtx.Provider value={setter}>
                        {children}
                    </SetterCtx.Provider>
                </GetterCtx.Provider>
            )
        }
        return null
    }

    const useAsSetterHook = (): S => useContextAsHook(SetterCtx)
    const useAsGetterHook = (): G => useContextAsHook(GetterCtx)

    const useAsHook = (): [G, S] => [useAsGetterHook(), useAsSetterHook()]

    return { Provider, useAsHook, useAsGetterHook, useAsSetterHook }
}

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

    const useAsHook = (): T => useContextAsHook(Context)

    return { Provider, useAsHook }
}

export { createProviderHook, createGetterSetterProviderHook }
