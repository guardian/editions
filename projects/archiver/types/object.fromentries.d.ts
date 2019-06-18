declare function index<K extends PropertyKey, T = any>(
    entries: Iterable<readonly [K, T]>,
): { [k in K]: T }

declare namespace index {
    function getPolyfill(): any
    // Circular reference from index
    const implementation: any
    function shim(): any
}

export = index
