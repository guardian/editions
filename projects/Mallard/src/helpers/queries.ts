import { useEffect, useState, useContext, createContext } from 'react'

/**
 * Keeps track of the state of a specific query run with specific variables.
 */
type QueryNode = {
    /* Identifies uniquely this node in the graph, built from the query ID and
     * variables. */
    key: string
    /* The query being run. */
    query: Query<unknown, unknown>
    /* The variables used to run the query. */
    variables: unknown
    /* If the query is running right now, this will be defined. Set to
     * `undefined` once we got a result value (or an error). */
    promise: Promise<unknown> | undefined
    /* The value the query resolved to. `undefined` if we didn't
     * get a result yet. */
    value: unknown
    /* Same as `value` but in case the query was rejected. */
    error: unknown
    /* Keeps track of the keys of other nodes this query run depend on. */
    deps: Set<string>
    /* Reverse-linking of `deps` ("predecessors"). */
    preds: Set<string>
    /* Functions that must be called when the value/error state changes. */
    listeners: (() => void)[]
}

/**
 * Only plain JavaScript types are allowed in variables because it needs to
 * be serializable with `JSON.stringify()`
 */
type AllowedVariableValues = number | string | boolean
type AllowedVariables = {
    [key: string]: AllowedVariableValues
}

/**
 * Resolves a query which the currently running query depends on.
 */
export type LocalResolver = <Value, Variables extends AllowedVariables>(
    query: Query<Value, Variables>,
    variables: Variables,
) => Promise<Value>

/**
 * Entry point for a query.
 */
export type QueryResolver<Value, Variables> = (
    variables: Variables,
    resolve: LocalResolver,
    prevValue: Value,
) => Promise<Value>

/**
 * Explicitly adding `undefined` fields makes refinement easier
 * for consumer code.
 */
export type QueryResult<Value> =
    | { loading: true; value: undefined; error: undefined }
    | { loading: undefined; value: Value; error: undefined }
    | { loading: undefined; value: undefined; error: unknown }

const formatResult = <Value>(node: QueryNode): QueryResult<Value> => {
    if (node.value) return { value: node.value as Value } as QueryResult<Value>
    if (node.error) return { error: node.error } as QueryResult<Value>
    return { loading: true } as QueryResult<Value>
}

const EMPTY_STR_SET: Set<string> = new Set()

class QueryAbortedError extends Error {
    constructor() {
        super(
            'The current query has been aborted because one of its ' +
                'dependencies got invalidated.',
        )
    }
}

/**
 * Keeps track of query promises, results, errors and inter-dependencies.
 */
export class QueryEnvironment {
    private _graph = new Map<string, QueryNode>()

    /**
     * Given the specific `query`, call `callback` every time its value changes.
     * If the query hasn't been started yet, this function will do so.
     */
    watch<Value, Variables extends AllowedVariables>(
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

    /**
     * Look at the current value of a particular `query` without having any
     * side effect. If the query has never been run and is not running, return
     * as if it was loading, but do not trigger an actual run.
     */
    peek<Value, Variables extends AllowedVariables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ): QueryResult<Value> {
        const key = this._getKey(query, variables)
        const node = this._graph.get(key)
        if (node === undefined) return { loading: true } as QueryResult<Value>
        return formatResult(node)
    }

    /**
     * Mark a `query` with particular `variables` as now being stale and
     * in need to be run again. If it never ran before, nothing happens.
     * Otherwise it is run along all the queries depending on it, and listeners
     * are notified of the new values.
     */
    invalidate<Value, Variables extends AllowedVariables>(
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

    private _resolve(
        context: { node: QueryNode; promise: Promise<unknown> | undefined },
        query: Query<unknown, unknown>,
        variables: unknown,
    ) {
        if (context.promise !== context.node.promise)
            throw new QueryAbortedError()

        const subNode = this._getNode(query, variables)
        context.node.deps.add(subNode.key)
        subNode.preds.add(context.node.key)
        if (subNode.promise !== undefined) return subNode.promise
        if (subNode.value !== undefined) return Promise.resolve(subNode.value)
        if (subNode.error !== undefined) return Promise.reject(subNode.error)
        throw new Error('inconsistent graph')
    }

    private async _handleNodePromise(
        node: QueryNode,
        promise: Promise<unknown>,
    ) {
        let value, error
        try {
            value = await promise
        } catch (err) {
            error = err
        }
        // if the node has been refreshed again in between, we ignore results
        if (node.promise !== promise) return
        node.promise = undefined
        node.value = value
        node.error = error

        for (const listener of node.listeners) {
            listener()
        }
    }

    private _refresh(node: QueryNode, trail: Set<string>) {
        if (trail.has(node.key))
            throw new Error('circular dependency between queries')

        // We first remove all our dependencies. This is because the new run
        // of the resolver might well depend on a different set of
        // queries/variables, so we're going to collect them from scratch.
        for (const depKey of node.deps) {
            const dep = this._graph.get(depKey)
            if (dep === undefined || !dep.preds.has(node.key))
                throw new Error('inconsistent graph')
            dep.preds.delete(node.key)
        }
        node.deps.clear()

        const prevValue = node.value
        const context = {
            node,
            promise: undefined as (Promise<unknown> | undefined),
        }
        const resolve: any = this._resolve.bind(this, context)

        // Use `Promise.resolve()` to ensure that `resolve` is only ever called
        // when this function is done running (ie. asynchronously).
        const promise = Promise.resolve().then(() =>
            node.query.resolver(node.variables, resolve, prevValue),
        )
        context.promise = promise
        node.promise = promise
        this._handleNodePromise(node, promise).catch(error => {
            // "Escape" the Promise to throw in the global context so that
            // this triggers the global "unhandled errors" handler.
            setImmediate(() => {
                throw error
            })
        })

        const innerTrail = new Set(trail)
        innerTrail.add(node.key)

        // Now that the promise is set-up, trigger a refresh of all the nodes
        // that depends on the one being refreshed. They'll likely try to
        // resolve it again, and thus await on our fresh promise.
        for (const predKey of node.preds) {
            const pred = this._graph.get(predKey)
            if (pred === undefined || !pred.deps.has(node.key))
                throw new Error('inconsistent graph')
            this._refresh(pred, innerTrail)
        }
    }

    /**
     * When there is no more listeners or predecessors on a node, we can
     * forget about it and drop the data.
     */
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

    public readonly resolver: QueryResolver<Value, Variables>
    public readonly id: number

    private constructor(resolver: QueryResolver<Value, Variables>) {
        this.id = Query._nextId++
        this.resolver = resolver
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

/**
 * From a React component, give the current status of a `query` and re-render
 * when any changes happens. For example if the query is invalidated and the
 * result is different.
 */
export const useQuery = <Value, Variables extends AllowedVariables>(
    query: Query<Value, Variables>,
    variables: Variables,
): QueryResult<Value> => {
    const env = useQueryEnvironment()
    const [result, setResult] = useState(env.peek(query, variables))
    const serializedVars = JSON.stringify(variables)
    useEffect(
        () => env.watch(query, JSON.parse(serializedVars), setResult),
        // We don't want to depend on an object by referential equality, but
        // instead rely on the object as a value. The easiest way to do this is
        // to serialize that value.
        [env, query, serializedVars],
    )
    return result
}
