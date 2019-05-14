import { useEffect, useState } from 'react'

export const useFetch = <Fetchable>(
    url: string,
    initialState: Fetchable,
    transform: (_: Fetchable) => Fetchable = res => res,
): Fetchable => {
    const [data, updateData] = useState(initialState)
    useEffect(() => {
        fetch(url).then(res =>
            res.json().then(res => {
                updateData(transform(res))
            }),
        )
    }, [])

    return data
}
