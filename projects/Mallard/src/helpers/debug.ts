import { memo, SFC } from 'react'

type DiffEntry<Props, K extends keyof Props> = {
    key: K
    prev: Props[K]
    next: Props[K]
}

type Diff<Props extends object> = DiffEntry<Props, keyof Props>[]

/**
 * This will help to log the difference between props on subsequen renders.
 *
 * You use it just as you would use React.memo, except the second argument
 * will pass you the prev / next props _and_ the array of diffs to log.
 *
 * If you only want to log the diffs of one specific component you can
 * use the props to and log conditionally e.g. and article id
 */
const logPropDiff = <T extends object>(
    component: SFC<T>,
    log: (prevProps: T, nextProps: T, diff: Diff<T>) => boolean = () => true,
) =>
    memo(component, (prevProps, nextProps) => {
        const allKeys = Object.keys(prevProps).concat(
            Object.keys(nextProps),
        ) as (keyof T)[]

        const diff: Diff<T> = []

        for (const key of allKeys) {
            const prev = prevProps[key]
            const next = nextProps[key]
            if (!Object.is(prev, next)) {
                diff.push({
                    key,
                    prev,
                    next,
                })
            }
        }

        log(prevProps, nextProps, diff)

        return false
    })

export { logPropDiff }
