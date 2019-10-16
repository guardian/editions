import moment, { MomentInput } from 'moment'
import { Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'
import {
    fetchFromNotificationService,
    notificationTracking,
} from 'src/helpers/fetch'
import {
    clearOldIssues,
    downloadAndUnzipIssue,
    matchSummmaryToKey,
} from 'src/helpers/files'
import { imageForScreenSize } from 'src/helpers/screen'
import { getIssueSummary } from 'src/hooks/use-issue-summary'
import { pushNotificationRegistrationCache } from './storage'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { errorService } from 'src/services/errors'

export interface PushNotificationRegistration {
    registrationDate: string
    token: string
}

const shouldReRegister = (
    newToken: string,
    registration: PushNotificationRegistration,
    now: MomentInput,
): boolean =>
    moment(now).diff(moment(registration.registrationDate), 'days') > 14 ||
    newToken !== registration.token

/**
 * will register / re-register if it should
 * will return whether it did register
 * will throw if anything major went wrong
 * */
const maybeRegister = async (
    token: string,
    // mocks for testing
    pushNotificationRegistrationCacheImpl = pushNotificationRegistrationCache,
    fetchFromNotificationServiceImpl = fetchFromNotificationService,
    now = moment().toString(),
) => {
    let should: boolean

    try {
        const cached = await pushNotificationRegistrationCacheImpl.get()
        should = !cached || shouldReRegister(token, cached, now)
    } catch {
        // in the unlikely event we have an error here, then re-register any way
        should = true
    }

    if (should) {
        // this will throw on non-200 so that we won't add registration info to the cache
        await fetchFromNotificationServiceImpl({ token })
        await pushNotificationRegistrationCacheImpl.set({
            registrationDate: now,
            token,
        })
        return true
    }

    return false
}

const pushNotifcationRegistration = () => {
    PushNotification.configure({
        onRegister: (token: { token: string } | undefined) => {
            if (token) {
                maybeRegister(token.token).catch(err => {
                    console.log(`Error registering for notifications: ${err}`)
                    errorService.captureException(err)
                })
            }
        },
        onNotification: async (notification: any) => {
            const key =
                Platform.OS === 'ios' ? notification.data.key : notification.key
            const notificationId =
                Platform.OS === 'ios'
                    ? notification.data.uniqueIdentifier
                    : notification.uniqueIdentifier

            if (key) {
                try {
                    const screenSize = await imageForScreenSize()
                    const issueSummaries = await getIssueSummary()
                    // Check to see if we can find the image summary for the one that is pushed
                    const pushImageSummary = matchSummmaryToKey(
                        issueSummaries,
                        key,
                    )

                    // Not there? Fahgettaboudit
                    if (!pushImageSummary) return null

                    notificationTracking(notificationId)
                    await downloadAndUnzipIssue(pushImageSummary, screenSize)
                    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                } catch (e) {
                    console.log(
                        `Push notification unable to download: ${e.message}`,
                    )
                    errorService.captureException(e)
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                }

                // No matter what happens, always clear up old issues
                clearOldIssues()
            }
        },
        senderID: defaultSettings.senderId,
        permissions: {
            alert: false,
            badge: false,
            sound: false,
        },
    })
}

export {
    pushNotifcationRegistration,
    /** exports for testing */
    maybeRegister,
}
