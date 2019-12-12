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

type Subscriber = ((p: Position) => void) | undefined
type SubscriberRef = MutableRefObject<Subscriber> | undefined
const NavPositionContext = createContext<SubscriberRef>(undefined)

type Props = { children: React.ReactNode }
export const NavPositionProvider = ({ children }: Props) => (
    <NavPositionContext.Provider value={useRef<Subscriber>(undefined)}>
        {children}
    </NavPositionContext.Provider>
)

/**
 * Return a function to set the current position of the view
 * showing the current issue.
 */
export const useSetNavPosition = () => {
    const state = useContext(NavPositionContext)
    return useCallback(
        (newPosition: Position) => {
            if (state === undefined) return
            if (state.current !== undefined) state.current(newPosition)
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
        if (state.current != null)
            throw new Error('cannot subscribe to nav position change twice')
        state.current = handler
        return () => (state.current = undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, ...deps])
}
