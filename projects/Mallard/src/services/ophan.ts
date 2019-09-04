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
    componentType: ComponentType
    action: Action
    value?: string
    componentId?: string
}

type UserId = string | null

const setUserId = (userId: UserId): Promise<UserId> =>
    NativeModules.Ophan.setUserId(userId)

const trackScreen = async ({
    screenName,
    value,
}: TrackScreen): Promise<boolean> =>
    NativeModules.Ophan.sendAppScreenEvent(screenName, value || '')

const trackComponentEvent = ({
    componentType,
    action,
    value,
    componentId,
}: TrackComponentEvent) =>
    NativeModules.Ophan.sendAppComponentEvent(
        componentType,
        action,
        value || '',
        componentId || '',
    )

export { trackScreen, trackComponentEvent, setUserId }
