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

it('rejects a query', async () => {
    const helloQuery = Query.create(
        jest.fn().mockImplementation(async () => {
            throw new Error('failed')
        }),
    )

    expect(env.peek(helloQuery, null)).toEqual({ loading: true })

    const [fn, join] = createJoinableFn()
    const release = env.watch(helloQuery, {}, fn)

    const result = await join()
    expect(result).toEqual({ error: new Error('failed') })
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

it('clear cache of unwatched queries', async () => {
    const helloQuery = Query.create(
        jest.fn().mockImplementation(async () => {
            return 'hello, world'
        }),
    )

    const [fn, join] = createJoinableFn()
    let release = env.watch(helloQuery, {}, fn)
    await join()
    expect(helloQuery.resolver).toHaveBeenCalledTimes(1)
    release()

    release = env.watch(helloQuery, {}, fn)
    await join()
    expect(helloQuery.resolver).toHaveBeenCalledTimes(2)
    release()
})

it('caches queries in progress watched simutaneously', async () => {
    const helloQuery = Query.create(
        jest.fn().mockImplementation(async () => {
            return 'hello, world'
        }),
    )

    const [fn1, join1] = createJoinableFn()
    const [fn2, join2] = createJoinableFn()
    let release1 = env.watch(helloQuery, {}, fn1)
    let release2 = env.watch(helloQuery, {}, fn2)

    expect(helloQuery.resolver).toHaveBeenCalledTimes(0)
    await join1()
    await join2()
    expect(helloQuery.resolver).toHaveBeenCalledTimes(1)

    release1()
    release2()
})

it('resolves a query with variables', async () => {
    const helloQuery = Query.create(
        jest.fn().mockImplementation(async ({ name }) => {
            return 'hello, ' + name
        }),
    )

    const [fn1, join1] = createJoinableFn()
    const release1 = env.watch(helloQuery, { name: 'world' }, fn1)

    let result = await join1()
    expect(result).toEqual({ value: 'hello, world' })
    expect(helloQuery.resolver).toHaveBeenCalledTimes(1)
    expect(fn1).toHaveBeenCalledTimes(1)

    const [fn2, join2] = createJoinableFn()
    const release2 = env.watch(helloQuery, { name: "y'all" }, fn2)

    result = await join2()
    expect(result).toEqual({ value: "hello, y'all" })
    expect(helloQuery.resolver).toHaveBeenCalledTimes(2)
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)

    release1()
    release2()
})

it('resolves recursive queries', async () => {
    const factorialQuery = Query.create(async (n: number, resolve) => {
        if (n === 0) return 1
        const result: number = await resolve(factorialQuery, n - 1)
        return result * n
    })

    const [fn, join] = createJoinableFn()
    const release = env.watch(factorialQuery, 4, fn)
    const result = await join()
    expect(result).toEqual({ value: 24 })

    release()
})
