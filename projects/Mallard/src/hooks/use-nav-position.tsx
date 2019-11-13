import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
} from 'react'

interface Position {
    frontId: string // Y coordinate
    articleIndex: number // X coordinate
}

interface NavPositionState {
    position: Position
    setPosition: Dispatch<SetStateAction<Position>>
    trigger: boolean
    setTrigger: Dispatch<SetStateAction<boolean>>
}

const initialState: NavPositionState = {
    position: {
        frontId: '',
        articleIndex: 0,
    },
    setPosition: () => {},
    trigger: false,
    setTrigger: () => {},
}

const NavPositionContext = createContext<NavPositionState>(initialState)

const NavPositionProvider = ({ children }: { children: React.ReactNode }) => {
    const [position, setPosition] = useState<Position>(initialState.position)
    const [trigger, setTrigger] = useState<boolean>(false)

    return (
        <NavPositionContext.Provider
            value={{
                position,
                setPosition,
                trigger,
                setTrigger,
            }}
        >
            {children}
        </NavPositionContext.Provider>
    )
}

const useNavPosition = () => useContext<NavPositionState>(NavPositionContext)

export { NavPositionProvider, useNavPosition }
