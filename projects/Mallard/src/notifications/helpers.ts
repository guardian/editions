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

const objectsEqual = (token1: PushToken, token2: PushToken) =>
    Object.keys(token1).length === Object.keys(token2).length &&
    token1.name === token2.name &&
    token2.type === token2.type

const isSameTopics = (t1: PushToken[] | null, t2: PushToken[]) => {
    if (t1 == null || t1.length != t2.length) return false

    for (let index = 0; index < t1.length; index++) {
        if (!objectsEqual(t1[index], t2[index])) return false
    }

    return true
}

const shouldReRegister = (
    newToken: string,
    registration: PushNotificationRegistration | null,
    now: MomentInput,
    currentTopics: PushToken[] | null,
    newTopics: PushToken[],
): boolean => {
    const exceedTime = registration
        ? moment(now).diff(moment(registration.registrationDate), 'days') > 14
        : true
    const differentToken = registration ? newToken !== registration.token : true
    const unmatchedTopics = !isSameTopics(currentTopics, newTopics)
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
        should = shouldReRegister(token, cached, now, currentTopics, newTopics)
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
