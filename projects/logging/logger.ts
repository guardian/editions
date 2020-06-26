import { configure, getLogger, addLayout } from 'log4js'

addLayout('json', () => {
    return logEvent => {
        return JSON.stringify(logEvent.data[0])
    }
})
configure({
    appenders: {
        jsonAppender: {
            type: 'stdout',
            layout: {
                type: 'json',
                separator: ',',
            },
        },
    },
    categories: {
        default: { appenders: ['jsonAppender'], level: 'info' },
    },
})
export const logger = getLogger()
