import React, {
    createContext,
    useContext,
    useRef,
    useEffect,
    MutableRefObject,
    DependencyList,
    useCallback,
} from 'react'

interface Position {
    frontId: string // Y coordinate
    articleIndex: number // X coordinate
}

type Subscriber = (p: Position) => void
type Subscribers = MutableRefObject<Subscriber[]> | undefined
const NavPositionContext = createContext<Subscribers | undefined>(undefined)

type Props = { children: React.ReactNode }
export const NavPositionProvider = ({ children }: Props) => {
    const subscribers = useRef<Subscriber[]>([])
    return (
        <NavPositionContext.Provider value={subscribers}>
            {children}
        </NavPositionContext.Provider>
    )
}

/**
 * Return a function to set the current position of the view
 * showing the current issue.
 */
export const useSetNavPosition = () => {
    const state = useContext(NavPositionContext)
    return useCallback(
        (newPosition: Position) => {
            if (state === undefined) return
            for (const sub of state.current) {
                sub(newPosition)
            }
        },
        [state],
    )
}

/**
 * Subscribe to a requested change of position of the view showing the
 * current issue. `deps` is anything the handler depends on,
 * just as with `useEffect`.
 */
export const useNavPositionChange = (
    handler: (p: Position) => void,
    deps: DependencyList = [],
) => {
    const state = useContext(NavPositionContext)
    useEffect(() => {
        if (state === undefined) return () => {}
        const { current } = state
        current.push(handler)
        return () => current.splice(current.indexOf(handler))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, ...deps])
}
