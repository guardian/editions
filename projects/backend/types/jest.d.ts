// this seems like a bug in eslint as it is clearly used here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Attempt } from '../utils/try'

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveFailed<T>(value: Attempt<T>): CustomMatcherResult
        }
    }
}
