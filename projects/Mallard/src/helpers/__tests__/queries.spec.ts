import { Query, QueryEnvironment } from '../queries'

let env: QueryEnvironment
beforeEach(() => {
    env = new QueryEnvironment()
})

it('resolve some value', () =>
    new Promise(resolve => {
        const HelloWorld = Query.create(async () => {
            return 'hello, world'
        })

        expect(env.peek(HelloWorld, {})).toEqual({ loading: true })
        const release = env.watch(HelloWorld, {}, result => {
            expect(result).toEqual({ value: 'hello, world' })
            release()
            resolve()
        })
    }))
