type ValidResult<T> = { type: 'valid-result'; data: T }
type InvalidResult = { type: 'invalid-result'; reason?: string }

export type AuthResult<T> = ValidResult<T> | InvalidResult

const cataResult = <T, R>(
    result: AuthResult<T>,
    {
        valid,
        invalid,
    }: {
        valid: (data: T) => R
        invalid: (reason?: string) => R
    },
) => {
    switch (result.type) {
        case 'valid-result': {
            return valid(result.data)
        }
        case 'invalid-result': {
            return invalid(result.reason)
        }
        default: {
            const x: never = result
            return x
        }
    }
}

const ValidResultCons = <T>(data: T): ValidResult<T> => ({
    type: 'valid-result',
    data,
})

const InvalidResultCons = (reason?: string): InvalidResult => ({
    type: 'invalid-result',
    reason,
})

const flat = async <T, U>(
    init: AuthResult<T>,
    mapper: (data: T) => Promise<AuthResult<U>>,
): Promise<AuthResult<U>> =>
    cataResult(init, {
        valid: mapper,
        invalid: async (...args) => InvalidResultCons(...args),
    })

export {
    cataResult,
    ValidResultCons as ValidResult,
    InvalidResultCons as InvalidResult,
    flat,
}
