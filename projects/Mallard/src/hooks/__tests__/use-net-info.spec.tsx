import { NetInfoStateContainer, NetInfoStateType } from '../use-net-info'
import { NetInfoState } from '@react-native-community/netinfo'

type Handler = (state: NetInfoState) => void

const createEmitter = () => {
    let bound: Handler = () => {}

    const register = jest.fn((fn: Handler) => {
        bound = fn
        return () => {}
    })

    return {
        register,
        emit: (state: NetInfoState) => bound(state),
    }
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

describe('use-net-info', () => {
    describe('NetInfoStateContainer', () => {
        it('registers when instantiated', () => {
            const emitter = createEmitter()
            new NetInfoStateContainer(emitter.register)
            expect(emitter.register).toHaveBeenCalledTimes(1)
        })

        describe('#fetch', () => {
            it('returns a promise that will resolves the first time the bound handler is called', async () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                const promise = nisc.fetch()
                emitter.emit(wifiState)
                const state = await promise
                expect(state).toBe(wifiState)
            })

            it('returns the latest value of the emitter as a promise', async () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                emitter.emit(wifiState)
                emitter.emit(cellularState)
                const state = await nisc.fetch()
                expect(state).toBe(cellularState)
            })
        })

        describe('#state', () => {
            it('returns the current state value', async () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                const promise = nisc.fetch()
                emitter.emit(wifiState)
                await promise
                expect(nisc.state).toBe(wifiState)
            })
        })

        describe('#subscribe', () => {
            it('forwards messages that are fired from the handlers it has registered with', () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                const sub = jest.fn()
                nisc.subscribe(sub)
                emitter.emit(wifiState)
                expect(sub).toBeCalledWith(wifiState)
            })
        })

        describe('#setForceOffline', () => {
            it('sets the state to be offline', async () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                nisc.setForceOffline(true)
                expect(nisc.state).toStrictEqual(offlineState)
            })

            it('overrides the actual state', async () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                emitter.emit(wifiState)
                nisc.setForceOffline(true)
                expect(nisc.state).toStrictEqual(offlineState)
            })

            it('runs the registerd handlers on change', async () => {
                const emitter = createEmitter()
                const nisc = new NetInfoStateContainer(emitter.register)
                const sub = jest.fn()
                nisc.subscribe(sub)
                nisc.setForceOffline(true)
                expect(sub).toBeCalledWith(offlineState)
            })
        })
    })
})
