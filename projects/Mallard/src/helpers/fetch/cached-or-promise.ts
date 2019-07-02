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

Without a CachedOrPromise:
const useData = (promise) => {
    const [result, setResult] = useState(null) :(
    useEffect(()=>{
        promise().then(val => {setResult(val)})
    },[])
    return result;
}

With a CachedOrPromise:
const useData = (createCachedOrPromise) => {
    const initialState = isPromise(createCachedOrPromise) ? null : createCachedOrPromise.value;
    const [result, setResult] = useState(initialState) :D
    useEffect(()=>{
        //or call it again?
        if(isNotCached(createCachedOrPromise)){
            createCachedOrPromise.getValue().then(val => {setResult(val)})
        }
    },[])
    return result;
}
*/

interface SlowPromiseGetter<T> {
    type: 'promise'
    getValue: () => Promise<T>
}

interface CachedResult<T> {
    type: 'value'
    value: T
    getValue: () => Promise<T>
}

export type CachedOrPromise<T> = CachedResult<T> | SlowPromiseGetter<T>

const isNotCached = <T>(
    cachedOrPromise: CachedOrPromise<T>,
): cachedOrPromise is SlowPromiseGetter<T> => cachedOrPromise.type === 'promise'

const createCachedOrPromise = <T>(
    [value, promiseGetter]: [T | null | undefined, () => Promise<T>],
    {
        savePromiseResultToValue,
    }: { savePromiseResultToValue: (result: T) => void },
): CachedOrPromise<T> => {
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

export { isNotCached, createCachedOrPromise }
