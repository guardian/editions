import AsyncStorage from '@react-native-community/async-storage'
import { londonTime } from 'src/helpers/date'
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

const pushTracking = async (id: string, value: string) => {
    try {
        const storedTracking = await AsyncStorage.getItem(PUSH_TRACKING_KEY)
        const tracking: Tracking = {
            time: londonTime().format(),
            id,
            value,
        }

        const saveTracking = storedTracking
            ? [...JSON.parse(storedTracking), tracking]
            : [tracking]

        await AsyncStorage.setItem(
            PUSH_TRACKING_KEY,
            JSON.stringify(saveTracking),
        )
    } catch (e) {
        errorService.captureException(e)
    }
}

export { pushTracking, getPushTracking, clearPushTracking }
