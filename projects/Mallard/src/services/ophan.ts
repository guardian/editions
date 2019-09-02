// Based on: https://github.com/guardian/ophan/blob/master/event-model/src/main/thrift/componentevent.thrift

import { NativeModules } from 'react-native'

enum ComponentType {
    APP_BUTTON,
    APP_VIDEO,
    APP_AUDIO,
}

enum Action {
    CLICK,
    VIEW,
}

interface TrackScreen {
    screenName: string
    value?: string
}

interface TrackComponentEvent {
    component: ComponentType
    action: Action
    value?: string
    id?: string
}

type UserId = string | null

const setUserId = (userId: UserId): Promise<UserId> => {
    return NativeModules.Ophan.setUserId(userId)
}

const trackScreen = async ({
    screenName,
    value,
}: TrackScreen): Promise<boolean> =>
    NativeModules.Ophan.sendAppScreenEvent(screenName, value || '')

const trackComponentEvent = ({
    component,
    action,
    value,
    id,
}: TrackComponentEvent) =>
    NativeModules.Ophan.sendAppComponentEvent(
        component,
        action,
        value || '',
        id || '',
    )

export { trackScreen, trackComponentEvent, setUserId }
