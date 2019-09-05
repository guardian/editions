import { NativeModules } from 'react-native'

type UserId = string | null

const setUserId = (userId: UserId): Promise<UserId> => {
    return NativeModules.Ophan.setUserId(userId)
}

export { setUserId }
