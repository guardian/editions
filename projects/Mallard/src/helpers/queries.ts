import { useEffect, useState } from 'react'
import { watch } from 'fs'

type QueryNode = {
    key: string
    query: unknown
    promise: Promise<unknown> | undefined
    value: unknown
    error: unknown
    variables: unknown
    deps: string[]
    preds: string[]
    listeners: (() => void)[]
}

type Resolver = <RValue, RVars>(
    query: Query<RValue, RVars>,
    variables: RVars,
) => QueryResult<RValue>
type QueryResolver<Value, Variables> = (
    variables: Variables,
    resolve: Resolver,
) => Promise<Value>

export type QueryResult<Value> =
    | { loading: true }
    | { value: Value }
    | { error: Error }

const formatResult = <Value>(node: QueryNode) => {
    return {
        value: node.value,
        error: node.error,
        loading:
            node.value == null && node.error == null && node.promise != null,
    } as QueryResult<Value>
}

export class Query<Value, Variables> {
    private static _graph = new Map<string, QueryNode>()
    private _resolver: QueryResolver<Value, Variables>

    private _id: number
    private static _nextId = 1

    private constructor(resolver: QueryResolver<Value, Variables>) {
        this._id = Query._nextId++
        this._resolver = resolver
    }

    static create<Value, Variables>(resolver: QueryResolver<Value, Variables>) {
        return new Query(resolver)
    }

    private static _getKey<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ) {
        return query._id + ':' + JSON.stringify(variables)
    }

    private static _getNode<Value, Variables>(
        query: Query<Value, Variables>,
        variables: Variables,
    ): QueryNode {
        const key = this._getKey(query, variables)
        let node = this._graph.get(key)
        if (node !== undefined) return node

        const qnode: QueryNode = {
            key,
            query,
            promise: undefined,
            value: undefined,
            error: undefined,
            variables,
            deps: [],
            preds: [],
            listeners: [],
        }
        const resolve = (
            query: Query<unknown, unknown>,
            variables: unknown,
        ) => {
            const subNode = this._getNode(query, variables)
            qnode.deps.push(subNode.key)
            subNode.preds.push(qnode.key)
            if (subNode.value !== undefined)
                return Promise.resolve(subNode.value)
            if (subNode.error !== undefined)
                return Promise.resolve(subNode.error)
            return subNode.promise
        }

        const promise = query._resolver(
            variables,
            (resolve as unknown) as Resolver,
        )
        qnode.promise = promise
        promise.then(
            value => {
                qnode.promise = undefined
                qnode.value = value
            },
            error => {
                qnode.promise = undefined
                qnode.error = error
            },
        )
        return qnode
    }

    private static _releaseNode(node: QueryNode): void {
        if (node.listeners.length > 0 || node.preds.length > 0) return
        for (const depKey of node.deps) {
            const dnode = this._graph.get(depKey)
            if (dnode === undefined) throw new Error('inconsistent state')
            dnode.preds.splice(dnode.preds.indexOf(node.key))
            this._releaseNode(dnode)
        }
        this._graph.delete(node.key)
    }

    /**
     * Given the specific `query`, call `callback` everytime the value changes.
     * If the query hasn't been resolved yet, this function will do so.
     */
    watch(
        variables: Variables,
        listener: (value: QueryResult<Value>) => unknown,
    ): () => void {
        const node = Query._getNode(this, variables)
        const callback = () => {
            listener(formatResult(node))
        }
        node.listeners.push(callback)
        return () => {
            node.listeners.splice(node.listeners.indexOf(callback), 1)
            Query._releaseNode(node)
        }
    }

    peek(variables: Variables): QueryResult<Value> {
        const key = Query._getKey(this, variables)
        const node = Query._graph.get(key)
        if (node === undefined) return { loading: true }
        return formatResult(node)
    }
}

export const useQuery = <Value, Variables>(
    query: Query<Value, Variables>,
    variables: Variables,
): QueryResult<Value> => {
    const [result, setResult] = useState(query.peek(variables))
    useEffect(
        () =>
            query.watch(variables, newResult => {
                setResult(newResult)
            }),
        [query, variables],
    )
    return result
}
