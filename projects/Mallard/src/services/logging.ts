// Logging Service that sends event logs to ELK
import DeviceInfo from 'react-native-device-info'
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { Platform } from 'react-native'
import { isInBeta } from 'src/helpers/release-stream'

type Level = 'WARN' | 'INFO' | 'ERROR' | 'DEBUG'

interface Log {
    app: string
    timestamp: Date
    version: string
    buildNumber: string
    level: Level
    message: object
    release_channel: 'BETA' | 'RELEASE'
    os: 'android' | 'ios'
    device: string
    network_status: NetInfoStateType
}

// TASK 1
// Additional fields we may want but need to check with Privacy team
/*
    - Device Id
    - User Id
    - Edition type they are looking at (one for later)
    - Subscription type
    - Subscription Status
 */

const baseLog = async ({
    level,
    message,
    ...optionalFields
}: {
    level: Level
    message: object
    optionalFields?: object
}): Promise<Log> => {
    const network_status = await NetInfo.fetch()
    return {
        app: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
        os: Platform.OS === 'ios' ? 'ios' : 'android',
        device: DeviceInfo.getDeviceId(),
        network_status: network_status.type,
        release_channel: isInBeta() ? 'BETA' : 'RELEASE',
        timestamp: new Date(),
        level,
        message,
        ...optionalFields,
    }
}

// TASK 1.5
// Consent management?

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

 Async storage cache helpers/storage
 -- offline
 -- get from async cache
 -- append to end
 -- set in async cache
 -- loop while offline
 -- online? send logs
 -- success? reset cache

 -- look to keep last 100 logs?

*/
//

export { baseLog }
