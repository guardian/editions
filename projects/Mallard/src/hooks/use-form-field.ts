import { useEffect, useState } from 'react'

export interface FormField {
    value: string
    setValue: (value: string) => void
    error: string | null
}

const useFormField = (
    initialValue: string,
    {
        validator,
        onSet,
    }: {
        validator: (value: string) => string | null
        onSet?: (value: string) => void
    },
): FormField => {
    const [hasInput, setHasInput] = useState(false)
    const [value, setValue] = useState(initialValue)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        hasInput && setError(validator(value))
    }, [hasInput, validator, value])

    return {
        value,
        setValue: value => {
            setHasInput(true)
            onSet && onSet(value)
            setValue(value)
        },
        error,
    }
}

export { useFormField }
