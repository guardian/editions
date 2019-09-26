import { ActionSheetIOS, Platform, Alert } from 'react-native'

/**
 * iOS action sheets have not parallel on Android so just replace them with
 * an Alert
 */
const runActionSheet = (
    title: string,
    message: string,
    options: { text: string; onPress: () => void }[],
) =>
    Platform.select({
        ios: () =>
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: [...options.map(({ text }) => text), 'Cancel'],
                    title,
                    message,
                    cancelButtonIndex: options.length,
                },
                async index =>
                    index !== options.length && options[index].onPress(),
            ),
        android: () => Alert.alert(title, message, options),
    })()

export { runActionSheet }
