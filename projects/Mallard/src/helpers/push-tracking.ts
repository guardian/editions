import AsyncStorage from '@react-native-community/async-storage'
import { londonTime } from 'src/helpers/date'
import { lastNDays } from 'src/helpers/issues'
import { errorService } from 'src/services/errors'

const PUSH_TRACKING_KEY = '@push-tracking'

interface Tracking {
    time: string
    id: string
    value: string
}

const getPushTracking = async (): Promise<string | null> =>
    AsyncStorage.getItem(PUSH_TRACKING_KEY)

const clearPushTracking = async (): Promise<void> =>
    AsyncStorage.removeItem(PUSH_TRACKING_KEY)

const pushTracking = async (id: string, value: string): Promise<void> => {
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

        return await AsyncStorage.setItem(
            PUSH_TRACKING_KEY,
            JSON.stringify(saveTracking),
        )
    } catch (e) {
        errorService.captureException(e)
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
}
