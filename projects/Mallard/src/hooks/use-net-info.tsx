import * as NetInfo from '@react-native-community/netinfo'
import { NetInfoState } from '@react-native-community/netinfo' // types
import React, { createContext, useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

/**
 * The purpose of this module is to create a wrapper around netinfo
 *
 * This has two benefits:
 * 1. We can fake our offline status in the app. This _doesn't_ mean
 * all `fetch` requests will fail. It just means that wherever we're
 * explicitly checking the netinfo status, we can override it in __DEV__
 *
 * Currently aeroplane mode doesn't work in the Simulator, and switching on
 * aeroplane mode while debugging on device ends up disconnecting you from
 * the debugger and throwing an error in the app
 *
 * Potentially we can wrap our fetches in checks to this status in future
 * if it would be helpful to both not fetch when we're offline and again,
 * mock an offline status.
 *
 * 2. The original `useNetInfo` hook seemed to exhibit a re-render quickly
 * after the first mount. Now that we store the info in a state container
 * we can immediately return the current value without having to return
 * unknown while waiting for a promise to resolve
 **/

const { NetInfoStateType } = NetInfo

const StableNetInfoContext = createContext<NetInfoState>({
    type: NetInfoStateType.unknown,
    isConnected: false,
    details: null,
})

const offlineState = {
    type: NetInfoStateType.none,
    isConnected: false,
    details: null,
} as const

const devToggleStyles = StyleSheet.create({
    bg: {
        backgroundColor: 'black',
        padding: 8,
        borderRadius: 999,
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 999999999,
    },
    text: {
        color: 'white',
    },
})

export class NetInfoStateContainer {
    private firstStatePromise: Promise<NetInfoState> | null
    private actualState: NetInfoState
    private subscribers: ((state: NetInfoState) => void)[] = []
    private forceOffline = false

    constructor() {
        this.actualState = {
            type: NetInfoStateType.unknown,
            isConnected: false,
            details: null,
        }
        /**
         * this will wait for the first state and then clear itself,
         * in order to return an accurate value for fetch for the first time
         *
         * it also registers the general update handler
         */
        this.firstStatePromise = new Promise(res =>
            NetInfo.addEventListener(state => {
                if (this.firstStatePromise) {
                    res(state)
                }
                this.onInternalStateChanged(state, this.forceOffline)
                this.firstStatePromise = null
            }),
        )
    }

    get state() {
        return this.forceOffline ? offlineState : this.actualState
    }

    get isForcedOffline() {
        return this.forceOffline
    }

    subscribe(fn: (state: NetInfoState) => void) {
        this.subscribers.push(fn)
        fn(this.state)
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn)
        }
    }

    fetch() {
        return this.firstStatePromise || Promise.resolve(this.state)
    }

    toggleForceOffline() {
        this.setForceOffline(!this.forceOffline)
    }

    setForceOffline(value: boolean) {
        this.onInternalStateChanged(this.actualState, value)
    }

    private onInternalStateChanged(
        nextActualState: NetInfoState,
        forceOffline: boolean,
    ) {
        this.actualState = nextActualState
        this.forceOffline = forceOffline
        this.updateListeners()
    }

    private updateListeners() {
        this.subscribers.forEach(_ => _(this.state))
    }
}

/** singleton state container */
const netInfoStateContainer = new NetInfoStateContainer()

/** Replace the netinfo API  */
const addEventListener = netInfoStateContainer.subscribe.bind(
    netInfoStateContainer,
)

/**
 * Replace the netinfo API
 *
 **/
const fetch = netInfoStateContainer.fetch.bind(netInfoStateContainer)

/**
 * This _may_ return unknown in the first few moments of the app launching
 * is useful for getting a synchronous result, at the rist of potentially
 * receiving an `unknown` state
 */
const fetchImmediate = () => netInfoStateContainer.state

const NetInfoProvider = ({ children }: { children: React.ReactNode }) => {
    const [netInfo, setNetInfo] = useState(netInfoStateContainer.state)
    useEffect(() => addEventListener(setNetInfo), [])
    return (
        <StableNetInfoContext.Provider value={netInfo}>
            {children}
            {__DEV__ && (
                <View style={devToggleStyles.bg}>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            netInfoStateContainer.toggleForceOffline()
                        }
                    >
                        <Text style={devToggleStyles.text}>
                            Net info{': '}
                            {netInfoStateContainer.isForcedOffline
                                ? 'forced offline'
                                : netInfo.type}
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
            )}
        </StableNetInfoContext.Provider>
    )
}

const useNetInfo = () => useContext(StableNetInfoContext)

export {
    NetInfoProvider,
    NetInfoStateType,
    useNetInfo,
    addEventListener,
    fetch,
    fetchImmediate,
}
