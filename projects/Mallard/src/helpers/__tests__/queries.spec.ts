import { Query, QueryEnvironment } from '../queries'

let env: QueryEnvironment
beforeEach(() => {
    env = new QueryEnvironment()
})

const createJoinableFn = <Value>(): [
    (value: Value) => void,
    () => Promise<Value>,
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
    const join = async () => {
        const value = await promise
        resolved = false
        return value
    }
    return [fn, join]
}

it('resolves a query', async () => {
    const helloQuery = Query.create(async () => {
        return 'hello, world'
    })

    expect(env.peek(helloQuery, null)).toEqual({ loading: true })

    const [fn, join] = createJoinableFn()
    const release = env.watch(helloQuery, {}, fn)
    const result = await join()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ value: 'hello, world' })
    release()
})

it.only('resolves nested queries', async () => {
    let name = 'world'
    const nameQuery = Query.create(async () => {
        return name
    })

    const helloQuery = Query.create(async (vars, resolve) => {
        const name = await resolve(nameQuery, null)
        return 'hello, ' + name
    })

    expect(env.peek(helloQuery, null)).toEqual({ loading: true })

    const [fn, join] = createJoinableFn()
    const release = env.watch(helloQuery, {}, fn)
    const result = await join()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ value: 'hello, world' })

    name = "y'all"
    env.invalidate(nameQuery, null)
})
