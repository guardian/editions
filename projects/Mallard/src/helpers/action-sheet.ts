import { ActionSheetIOS, Platform, Alert } from 'react-native'

/**
 * iOS action sheets have not parallel on Android so just replace them with
 * an Alert
 */
const runActionSheet = (
    title: string,
    message: string,
    options: { text: string; onPress: () => void }[],
) => {
    const optionsWithCancel = options.concat({
        text: 'Cancel',
        onPress: () => {},
    })
    return Platform.select({
        ios: () =>
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: optionsWithCancel.map(({ text }) => text),
                    title,
                    message,
                    cancelButtonIndex: options.length,
                },
                async index =>
                    index !== options.length && options[index].onPress(),
            ),
        android: () =>
            Alert.alert(title, message, optionsWithCancel.slice().reverse()),
    })()
}

export { runActionSheet }
