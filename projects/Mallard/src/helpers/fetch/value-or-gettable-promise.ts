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

Without a ValueOrGettablePromise:
const useData = (promise) => {
    const [result, setResult] = useState(null) :(
    useEffect(()=>{
        promise().then(val => {setResult(val)})
    },[])
    return result;
}

With a ValueOrGettablePromise:
const useData = (vorgp) => {
    const initialState = isPromise(vorgp) ? null : vorgp.value;
    const [result, setResult] = useState(initialState) :D
    useEffect(()=>{
        if(isGettablePromise(vorgp)){
            vorgp.getValue().then(val => {setResult(val)})
        }
    },[])
    return result;
}
*/

interface GettablePromise<T> {
    type: 'promise'
    getValue: () => Promise<T>
}

interface Value<T> {
    type: 'value'
    value: T
}

export type ValueOrGettablePromise<T> = Value<T> | GettablePromise<T>

const isGettablePromise = <T>(
    vorgp: ValueOrGettablePromise<T>,
): vorgp is GettablePromise<T> => vorgp.type === 'promise'

const valueOrGettablePromise = <T>({
    value,
    promiseGetter,
    savePromiseResultToInstantValue,
}: {
    value: () => T | null | undefined
    promiseGetter: () => Promise<T>
    savePromiseResultToInstantValue: (result: T) => void
}): ValueOrGettablePromise<T> => {
    const val = value()
    if (val) {
        return {
            type: 'value',
            value: val,
        }
    }
    return {
        type: 'promise',
        getValue: async () => {
            const val = await promiseGetter()
            savePromiseResultToInstantValue(val)
            return val
        },
    }
}

export { isGettablePromise, valueOrGettablePromise }
