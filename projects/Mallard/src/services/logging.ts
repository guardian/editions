// Logging Service that sends event logs to ELK
import DeviceInfo from 'react-native-device-info'

type Level = 'info' | 'error'

interface Log {
    stack: 'editions'
    app: string
    stage: 'CODE' | 'PROD'
    '@timestamp': Date
    '@version': string
    buildNumber: string
    level: Level
    level_value: number
    message: object
}

// TASK 1
// Additional fields we may want
/*
    - Device Id
    - User Id
    - Subscription type
    - Subscription Status
    - Edition type they are looking at (one for later)
    - Release Channel
    - OS
    - Device
    - Network availability at time of log
 */

const baseLog = ({
    level,
    level_value,
    message,
    ...optionalFields
}: {
    level: Level
    level_value: number
    message: object
    optionalFields?: object
}): Log => ({
    stack: 'editions',
    app: DeviceInfo.getBundleId(),
    stage: __DEV__ ? 'CODE' : 'PROD',
    '@version': DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    '@timestamp': new Date(),
    level,
    level_value,
    message,
    ...optionalFields,
})

// TASK 2
// Post to an external service the log

// TASK 3
// Manage offline when sending logs
/*
Offline considerations:
 - What do do when going offine
 - What to do when they come back online
 - Cleanup when successful logging queue has been processed
 - How do we manage different status codes coming back from logging service (and online)
*/
//

export { baseLog }
