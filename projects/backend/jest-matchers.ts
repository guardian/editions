import { hasFailed, Attempt } from './utils/try'

expect.extend({
    toHaveFailed: <T>(received: Attempt<T>) => {
        if (hasFailed(received)) {
            return {
                pass: true,
                message: `expected ${received} not to have failed, however it failed with ${received.error}`,
            }
        }
        return {
            pass: false,
            message: `expected ${received} to have failed, however it passed`,
        }
    },
})
