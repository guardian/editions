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

Without a InstantPromise:
const useData = (promise) => {
    const [result, setResult] = useState(null) :(
    useEffect(()=>{
        promise().then(val => {setResult(val)})
    },[])
    return result;
}

With a InstantPromise:
const useData = (instantPromise) => {
    const initialState = isPromise(instantPromise) ? null : instantPromise.value;
    const [result, setResult] = useState(initialState) :D
    useEffect(()=>{
        //or call it again?
        if(isSlowPromise(instantPromise)){
            instantPromise.getValue().then(val => {setResult(val)})
        }
    },[])
    return result;
}
*/

interface SlowPromise<T> {
    type: 'promise'
    getValue: () => Promise<T>
}

interface Value<T> {
    type: 'value'
    value: T
    getValue: () => Promise<T>
}

export type InstantPromise<T> = Value<T> | SlowPromise<T>

const isSlowPromise = <T>(
    instantPromise: InstantPromise<T>,
): instantPromise is SlowPromise<T> => instantPromise.type === 'promise'

const instantPromise = <T>(
    [value, promiseGetter]: [T | null | undefined, () => Promise<T>],
    {
        savePromiseResultToValue,
    }: { savePromiseResultToValue: (result: T) => void },
): InstantPromise<T> => {
    const getValue = async () => {
        const val = await promiseGetter()
        savePromiseResultToValue(val)
        return val
    }
    if (value) {
        return {
            type: 'value',
            value,
            getValue,
        }
    }
    return {
        type: 'promise',
        getValue,
    }
}

export { isSlowPromise, instantPromise }
