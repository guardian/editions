import { useEffect, useState, useContext, createContext } from 'react'

type QueryNode = {
    key: string
    query: Query<unknown, unknown>
    promise: Promise<unknown> | undefined
    value: unknown
    error: unknown
    variables: unknown
    deps: Set<string>
    preds: Set<string>
    listeners: (() => void)[]
}

type LocalResolver = <Value, Variables>(
    query: Query<Value, Variables>,
    variables: Variables,
) => Promise<Value>

type QueryResolver<Value, Variables> = (
    variables: Variables,
    resolve: LocalResolver,
) => Promise<Value>

type Invalidate<Variables> = (
    env: QueryEnvironment,
    variables: Variables,
) => void

export type QueryResult<Value> =
    | { loading: true }
    | { value: Value }
    | { error: unknown }

const formatResult = <Value>(node: QueryNode): QueryResult<Value> => {
    if (node.value) return { value: node.value as Value }
    if (node.error) return { error: node.error }
    return { loading: true }
}

const EMPTY_STR_SET: Set<string> = new Set()

export class QueryEnvironment {
    private _graph = new Map<string, QueryNode>()

    /**
     * Given the specific `query`, call `callback` everytime the value changes.
     * If the query hasn't been resolved yet, this function will do so.
     */
    watch<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
        listener: (value: QueryResult<Value>) => unknown,
    ): () => void {
        const node = this._getNode(query, variables)
        const callback = () => {
            listener(formatResult(node))
        }
        node.listeners.push(callback)
        return () => {
            node.listeners.splice(node.listeners.indexOf(callback), 1)
            this._releaseNode(node)
        }
    }

    peek<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ): QueryResult<Value> {
        const key = this._getKey(query, variables)
        const node = this._graph.get(key)
        if (node === undefined) return { loading: true }
        return formatResult(node)
    }

    invalidate<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ): void {
        const key = this._getKey(query, variables)
        const node = this._graph.get(key)
        if (node === undefined) return
        this._refresh(node, EMPTY_STR_SET)
    }

    private _getKey<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ) {
        return query.id + ':' + JSON.stringify(variables)
    }

    private _getNode<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ): QueryNode {
        const key = this._getKey(query, variables)
        let node = this._graph.get(key)
        if (node !== undefined) return node

        node = {
            key,
            query: (query as unknown) as Query<unknown, unknown>,
            promise: undefined,
            value: undefined,
            error: undefined,
            variables,
            deps: new Set(),
            preds: new Set(),
            listeners: [],
        }
        this._graph.set(key, node)
        this._refresh(node, EMPTY_STR_SET)
        return node
    }

    private _refresh(node: QueryNode, trail: Set<string>) {
        if (trail.has(node.key))
            throw new Error('circular dependency between queries')

        for (const depKey of node.deps) {
            const dep = this._graph.get(depKey)
            if (dep === undefined || !dep.preds.has(node.key))
                throw new Error('inconsistent graph')
            dep.preds.delete(node.key)
        }
        node.deps.clear()

        const resolve = (
            query: Query<unknown, unknown>,
            variables: unknown,
        ) => {
            const subNode = this._getNode(query, variables)
            node.deps.add(subNode.key)
            subNode.preds.add(node.key)
            if (subNode.promise !== undefined) return subNode.promise
            if (subNode.value !== undefined)
                return Promise.resolve(subNode.value)
            if (subNode.error !== undefined)
                return Promise.reject(subNode.error)
            throw new Error('inconsistent graph')
        }

        const promise = Promise.resolve().then(() =>
            node.query.resolver(
                node.variables,
                (resolve as unknown) as LocalResolver,
            ),
        )
        node.promise = promise
        promise
            .then(
                value => {
                    if (node.promise !== promise) return
                    node.promise = undefined
                    node.value = value
                },
                error => {
                    if (node.promise !== promise) return
                    node.promise = undefined
                    node.error = error
                },
            )
            .then(() => {
                for (const listener of node.listeners) {
                    listener()
                }
            })
            .catch(error => {
                setImmediate(() => {
                    throw error
                })
            })

        const innerTrail = new Set(trail)
        innerTrail.add(node.key)

        for (const predKey of node.preds) {
            const pred = this._graph.get(predKey)
            if (pred === undefined || !pred.deps.has(node.key))
                throw new Error('inconsistent graph')
            this._refresh(pred, innerTrail)
        }
    }

    private _releaseNode(node: QueryNode): void {
        if (node.listeners.length > 0 || node.preds.size > 0) return
        for (const depKey of node.deps) {
            const dnode = this._graph.get(depKey)
            if (dnode === undefined) throw new Error('inconsistent state')
            dnode.preds.delete(node.key)
            this._releaseNode(dnode)
        }
        this._graph.delete(node.key)
    }
}

export class Query<Value, Variables> {
    private static _nextId = 1

    private _resolver: QueryResolver<Value, Variables>
    private _id: number

    private constructor(resolver: QueryResolver<Value, Variables>) {
        this._id = Query._nextId++
        this._resolver = resolver
    }

    get id() {
        return this._id
    }

    get resolver() {
        return this._resolver
    }

    static create<Value, Variables>(
        resolver: QueryResolver<Value, Variables>,
    ): Query<Value, Variables> {
        return new Query(resolver)
    }
}

export const QueryEnvironmentContext = createContext<
    QueryEnvironment | undefined
>(undefined)

export const useQueryEnvironment = (): QueryEnvironment => {
    const env = useContext(QueryEnvironmentContext)
    if (env === undefined) throw new Error('no query environment availalbe')
    return env
}

export const useQuery = <Value, Variables>(
    query: Query<Value, Variables>,
    variables: Variables,
): QueryResult<Value> => {
    const env = useQueryEnvironment()
    const [result, setResult] = useState(env.peek(query, variables))
    useEffect(
        () =>
            env.watch(query, variables, newResult => {
                setResult(newResult)
            }),
        [query, variables],
    )
    return result
}
