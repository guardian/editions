import AsyncStorage from '@react-native-community/async-storage'
import { londonTime } from 'src/helpers/date'
import { lastNDays } from 'src/helpers/issues'
import { baseLog, Level } from 'src/services/logging'

const PUSH_TRACKING_KEY = '@push-tracking'

type PushTrackingId =
    | 'notification'
    | 'pushScreenSize'
    | 'pushIssueSummaries'
    | 'pushImageSummary'
    | 'pushDownloadComplete'
    | 'pushDownloadError'
    | 'notificationToken'
    | 'notificationTokenError'
    | 'tempFileRemoveError'
    | 'noAssets'
    | 'attemptDataDownload'
    | 'attemptMediaDownload'
    | 'unzipData'
    | 'unzipImages'
    | 'unzipError'
    | 'downloadAndUnzip'
    | 'downloadAndUnzipError'
    | 'downloadBlocked'
    | 'completeAndDeleteCache'
    | 'clearOldIssues'
    | 'backgroundFetch'
    | 'backgroundFetchStatus'
    | 'backgroundFetchError'

interface Tracking {
    time: string
    id: string
    value: string
}

const getPushTracking = async (): Promise<string | null> =>
    AsyncStorage.getItem(PUSH_TRACKING_KEY)

// Only get the start and end of the push notification process
const getDiagnosticPushTracking = async () => {
    try {
        const pushTrackingString = await AsyncStorage.getItem(PUSH_TRACKING_KEY)
        if (!pushTrackingString) {
            return null
        }

        const pushTracking = JSON.parse(pushTrackingString)
        return pushTracking.find(
            (o: Tracking) =>
                o.id === 'notification' || o.id === 'pushDownloadComplete',
        )
    } catch (e) {
        // Not essential so just log errors to console
        console.log('getDiagnosticPushTracking Error:', e)
    }
}

const clearPushTracking = async (): Promise<void> =>
    AsyncStorage.removeItem(PUSH_TRACKING_KEY)

const pushTracking = async (
    id: PushTrackingId,
    value: string,
): Promise<void> => {
    try {
        if (__DEV__) {
            console.log(`Push Tracking: ${id} | ${value}`)
        }

        const storedTracking = await AsyncStorage.getItem(PUSH_TRACKING_KEY)
        const tracking: Tracking = {
            time: londonTime().format(),
            id,
            value,
        }

        const saveTracking = storedTracking
            ? [...JSON.parse(storedTracking), tracking]
            : [tracking]

        const log = await baseLog({
            level: Level.INFO,
            message: { value },
            optionalFields: { id },
        })
        console.log(log)

        return await AsyncStorage.setItem(
            PUSH_TRACKING_KEY,
            JSON.stringify(saveTracking),
        )
    } catch (e) {
        // Not essential so just log errors to console
        console.log('Push Tracking Error:', e)
    }
}

export const findLastXDaysPushTracking = (
    pushTracking: Tracking[],
    days = 7,
) => {
    const daysToKeep = lastNDays(days)
    return pushTracking.filter(
        (log: Tracking) =>
            daysToKeep.some(day => log.time.includes(day)) && log,
    )
}

// Only keep the last X days of push logs when run
const cleanPushTrackingByDays = async () => {
    const pushTracking = await getPushTracking()

    if (!pushTracking) return

    const logsToKeep = findLastXDaysPushTracking(JSON.parse(pushTracking))
    return await AsyncStorage.setItem(
        PUSH_TRACKING_KEY,
        JSON.stringify(logsToKeep),
    )
}

export {
    pushTracking,
    getPushTracking,
    clearPushTracking,
    cleanPushTrackingByDays,
    getDiagnosticPushTracking,
}
