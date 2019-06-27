/*
Wrap a promise or an stored value in this
so hooks can access the value instantly

🤔 BUT WHY?
With hooks, we need an instant cache because that must
always return a value, so value-or-promise allows us to short
circuit all data fetching and stuff and return from the promise
layer as soon as we know what we want is stored in there while
still allowing all normal js goodness like testability or loops.

We need a function that returns a promise so we never accidentally
fire the promise inside the hook code (we need to wrap that
behavior in a useEffect).
This prevents infinite loops from firing off

*/

interface GettablePromise<T> {
    type: 'promise'
    getValue: () => Promise<T>
}

interface Value<T> {
    type: 'value'
    value: T
}

export type ValueOrPromise<T> = Value<T> | GettablePromise<T>

const isGettablePromise = <T>(
    vorgp: ValueOrPromise<T>,
): vorgp is GettablePromise<T> => vorgp.type === 'promise'

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

export { returnValue, returnGettablePromise, isGettablePromise }
