import {
    NetInfoStateContainer as NISC,
    NetInfoStateType,
} from '../use-net-info'
import { NetInfoState } from '@react-native-community/netinfo'

type Handler = (state: NetInfoState) => void

type NetInfoMock = {
    addEventListener: jest.Mock<(fn: Handler) => void>
    emit: Handler
}

const wifiState = {
    type: NetInfoStateType.wifi,
    isConnected: true,
    details: {
        isConnectionExpensive: false,
    },
} as NetInfoState

const cellularState = {
    type: NetInfoStateType.cellular,
    isConnected: true,
    details: {
        isConnectionExpensive: true,
    },
} as NetInfoState

const offlineState = {
    type: NetInfoStateType.none,
    isConnected: false,
    details: null,
} as NetInfoState

jest.mock(
    '@react-native-community/netinfo',
    (): NetInfoMock => {
        let bound: Handler = () => {}

        const addEventListener = jest.fn((fn: Handler) => {
            bound = fn
            return () => {}
        })

        const ret = {
            NetInfoStateType: {
                unknown: 'unknown',
            },
            addEventListener,
            emit: (state: NetInfoState) => bound(state),
        }
        return ret
    },
)

describe('use-net-info', () => {
    describe('NetInfoStateContainer', () => {
        let NetInfo: NetInfoMock
        let NetInfoStateContainer: typeof NISC

        beforeEach(() => {
            jest.resetModules()
            NetInfoStateContainer = require('../use-net-info')
                .NetInfoStateContainer
            NetInfo = require('@react-native-community/netinfo')
            NetInfo.addEventListener.mockClear() // ignore side-effects form module load
        })

        it('registers when instantiated', () => {
            new NetInfoStateContainer()
            expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1)
        })

        describe('#fetch', () => {
            it('returns a promise that will resolves the first time the bound handler is called', async () => {
                const nisc = new NetInfoStateContainer()
                const promise = nisc.fetch()
                NetInfo.emit(wifiState)
                const state = await promise
                expect(state).toBe(wifiState)
            })

            it('returns the latest value of the emitter as a promise', async () => {
                const nisc = new NetInfoStateContainer()
                NetInfo.emit(wifiState)
                NetInfo.emit(cellularState)
                const state = await nisc.fetch()
                expect(state).toBe(cellularState)
            })
        })

        describe('#state', () => {
            it('returns the current state value', async () => {
                const nisc = new NetInfoStateContainer()
                const promise = nisc.fetch()
                NetInfo.emit(wifiState)
                await promise
                expect(nisc.state).toBe(wifiState)
            })
        })

        describe('#subscribe', () => {
            it('forwards messages that are fired from the handlers it has registered with', () => {
                const nisc = new NetInfoStateContainer()
                const sub = jest.fn()
                nisc.subscribe(sub)
                NetInfo.emit(wifiState)
                expect(sub).toBeCalledWith(wifiState)
            })
        })

        describe('#setForceOffline', () => {
            it('sets the state to be offline', async () => {
                const nisc = new NetInfoStateContainer()
                nisc.setForceOffline(true)
                expect(nisc.state).toStrictEqual(offlineState)
            })

            it('overrides the actual state', async () => {
                const nisc = new NetInfoStateContainer()
                NetInfo.emit(wifiState)
                nisc.setForceOffline(true)
                expect(nisc.state).toStrictEqual(offlineState)
            })

            it('runs the registerd handlers on change', async () => {
                const nisc = new NetInfoStateContainer()
                const sub = jest.fn()
                nisc.subscribe(sub)
                nisc.setForceOffline(true)
                expect(sub).toBeCalledWith(offlineState)
            })
        })
    })
})
