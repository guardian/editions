import { Query, QueryEnvironment } from '../queries'

let env: QueryEnvironment
beforeEach(() => {
    env = new QueryEnvironment()
})

const createWaitableFn = <Value>(): [
    (value: Value) => void,
    Promise<Value>,
] => {
    let resolve: any
    let resolved = false
    const fn = jest.fn().mockImplementation(result => {
        if (resolved) throw new Error('resolved twice')
        resolved = true
        resolve(result)
    })
    const promise = new Promise<Value>(r => {
        resolve = r
    })
    return [fn, promise]
}

it('resolves a query', async () => {
    const HelloWorld = Query.create(async () => {
        return 'hello, world'
    })
    const [fn, promise] = createWaitableFn()

    expect(env.peek(HelloWorld, {})).toEqual({ loading: true })
    const release = env.watch(HelloWorld, {}, fn)
    const result = await promise

    expect(result).toEqual({ value: 'hello, world' })
    release()
})

// it('resolves nested queries', () =>
//     new Promise(resolve => {
//         let name = 'world'

//         const GetName = Query.create(async () => {
//             return name
//         })

//         const HelloWorld = Query.create(async (vars, resolve) => {
//             const name = await resolve(GetName, {})
//             return 'hello, ' + name
//         })

//         expect(env.peek(HelloWorld, {})).toEqual({ loading: true })
//         const release = env.watch(HelloWorld, {}, result => {
//             expect(result).toEqual({ value: 'hello, world' })
//             const release2 = env.watch(HelloWorld, {}, result => {
//                 expect(result).toEqual({ value: 'hello, there' })
//                 release2()
//                 resolve()
//             })
//             release()

//             name = 'there'
//             env.invalidate(GetName, {})
//         })
//     }))
