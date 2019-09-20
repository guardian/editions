import React, { createContext, useContext } from 'react'
import {
    useNetInfo as originalUseNetInfo,
    NetInfoState,
    NetInfoStateType,
} from '@react-native-community/netinfo'

const StableNetInfoContext = createContext<NetInfoState>({
    type: NetInfoStateType.unknown,
    isConnected: false,
    details: null,
})

const NetInfoProvider = ({ children }: { children: React.ReactNode }) => (
    <StableNetInfoContext.Provider value={originalUseNetInfo()}>
        {children}
    </StableNetInfoContext.Provider>
)

const useNetInfo = () => useContext(StableNetInfoContext)

export { NetInfoProvider, useNetInfo }
