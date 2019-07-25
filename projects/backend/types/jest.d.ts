import { Attempt } from '../utils/try'

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveFailed<T>(value: Attempt<T>): CustomMatcherResult
        }
    }
}
