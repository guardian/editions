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
    let promise = new Promise<Value>(r => (resolve = r))
    const join = async () => {
        const value = await promise
        promise = new Promise<Value>(r => (resolve = r))
        resolved = false
        return value
    }
    return [fn, join]
}

it('resolves a query', async () => {
    const helloQuery = Query.create(
        jest.fn().mockImplementation(async () => {
            return 'hello, world'
        }),
    )

    expect(env.peek(helloQuery, null)).toEqual({ loading: true })

    const [fn, join] = createJoinableFn()
    const release = env.watch(helloQuery, {}, fn)

    const result = await join()
    expect(result).toEqual({ value: 'hello, world' })
    expect(helloQuery.resolver).toHaveBeenCalledTimes(1)

    release()
    expect(fn).toHaveBeenCalledTimes(1)
})

it('resolves and updates nested queries', async () => {
    let name = 'world'
    const nameQuery = Query.create(
        jest.fn().mockImplementation(async () => {
            return name
        }),
    )

    const helloQuery = Query.create(
        jest.fn().mockImplementation(async (_vars, resolve) => {
            const name = await resolve(nameQuery, null)
            return 'hello, ' + name
        }),
    )

    expect(env.peek(helloQuery, null)).toEqual({ loading: true })

    const [fn, join] = createJoinableFn()
    const release = env.watch(helloQuery, {}, fn)

    let result = await join()
    expect(result).toEqual({ value: 'hello, world' })

    name = "y'all"
    env.invalidate(nameQuery, null)

    result = await join()
    expect(result).toEqual({ value: "hello, y'all" })
    expect(nameQuery.resolver).toHaveBeenCalledTimes(2)
    expect(helloQuery.resolver).toHaveBeenCalledTimes(2)

    release()
    expect(fn).toHaveBeenCalledTimes(2)
})
