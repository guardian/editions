interface GettablePromise<T> {
    type: 'promise'
    getValue: () => Promise<T>
}

interface Value<T> {
    type: 'value'
    value: T
}

export type ValueOrPromise<T> = Value<T> | GettablePromise<T>

const isPromise = <T>(vop: ValueOrPromise<T>): vop is GettablePromise<T> =>
    vop.type === 'promise'

const returnValue = <T>(value: T): Value<T> => ({
    type: 'value',
    value,
})

const returnGettablePromise = <T>(
    getValue: () => Promise<T>,
): GettablePromise<T> => ({
    type: 'promise',
    getValue,
})

export { returnValue, returnGettablePromise, isPromise }
