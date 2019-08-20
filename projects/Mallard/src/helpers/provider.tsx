import React, { createContext, useContext, useMemo } from 'react'
import { G } from 'react-native-svg'

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

    const ProviderWithHook = ({
        getter,
        setter,
        children,
    }: Exclude<GetterSetterHook<G, S>, null> & {
        children: React.ReactNode
    }) => {
        const memoizedSetter = useMemo(() => setter, []) as S
        return (
            <SetterCtx.Provider value={memoizedSetter}>
                <GetterCtx.Provider value={getter}>
                    {children}
                </GetterCtx.Provider>
            </SetterCtx.Provider>
        )
    }

    const Provider = ({ children }: { children: React.ReactNode }) => {
        const hookVal = hook()
        if (hookVal) {
            return <ProviderWithHook {...hookVal}>{children}</ProviderWithHook>
        }
        return null
    }

    const useAsSetterHook = (): S => useContextAsHook(SetterCtx)
    const useAsGetterHook = (): G => useContextAsHook(GetterCtx)

    return { Provider, useAsGetterHook, useAsSetterHook }
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
