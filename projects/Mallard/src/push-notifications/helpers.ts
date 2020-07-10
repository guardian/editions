import {
    PushToken,
    registerWithNotificationService,
} from './notification-service'
import { RegionalEdition } from 'src/common'
import { defaultRegionalEditions } from '../../../Apps/common/src/editions-defaults'
import { getDefaultEditionSlug } from 'src/hooks/use-edition-provider'
import { PushNotificationRegistration } from './push-notifications'
import moment, { MomentInput } from 'moment'
import {
    pushNotificationRegistrationCache,
    pushRegisteredTokens,
} from 'src/helpers/storage'

const BASE_PUSH_TOKEN = [{ name: 'uk', type: 'editions' }] as PushToken[]
const topicToEdition = new Map<RegionalEdition['edition'], PushToken[]>()
topicToEdition.set(defaultRegionalEditions[1].edition, [
    {
        name: 'au',
        type: 'editions',
    },
])
topicToEdition.set(defaultRegionalEditions[2].edition, [
    {
        name: 'us',
        type: 'editions',
    },
])
topicToEdition.set(defaultRegionalEditions[0].edition, BASE_PUSH_TOKEN)

const getTopicName = async (): Promise<PushToken[]> => {
    const defaultSlug = await getDefaultEditionSlug()
    if (defaultSlug) {
        const chosenTopic = topicToEdition.get(defaultSlug)
        return chosenTopic || BASE_PUSH_TOKEN
    }
    return BASE_PUSH_TOKEN
}

const shouldReRegister = (
    newToken: string,
    registration: PushNotificationRegistration,
    now: MomentInput,
    currentTopics: PushToken[],
    newTopics: PushToken[],
): boolean => {
    const exceedTime =
        moment(now).diff(moment(registration.registrationDate), 'days') > 14
    const differentToken = newToken !== registration.token
    const unmatchedTopics = currentTopics !== newTopics
    return exceedTime || differentToken || unmatchedTopics
}

/**
 * will register / re-register if it should
 * will return whether it did register
 * will throw if anything major went wrong
 * */
const maybeRegister = async (
    token: string,
    // mocks for testing
    pushNotificationRegistrationCacheImpl = pushNotificationRegistrationCache,
    registerWithNotificationServiceImpl = registerWithNotificationService,
    now = moment().toString(),
) => {
    let should: boolean
    const newTopics = await getTopicName()
    if (!newTopics) {
        return false
    }

    try {
        const currentTopics = await pushRegisteredTokens.get()
        const cached = await pushNotificationRegistrationCacheImpl.get()
        // do the topic check in shouldReRegister
        should =
            !cached ||
            !currentTopics ||
            shouldReRegister(token, cached, now, currentTopics, newTopics)
    } catch {
        // in the unlikely event we have an error here, then re-register any way
        should = true
    }

    if (should) {
        // this will throw on non-200 so that we won't add registration info to the cache
        const response = await registerWithNotificationServiceImpl(
            token,
            newTopics,
        )
        pushRegisteredTokens.set(response['topics'])

        await pushNotificationRegistrationCacheImpl.set({
            registrationDate: now,
            token,
        })
        return true
    }

    return false
}

export { getTopicName, maybeRegister, shouldReRegister }
