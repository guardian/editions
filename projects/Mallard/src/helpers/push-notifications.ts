import PushNotification from 'react-native-push-notification';
import { fetchFromNotificationService } from 'src/helpers/fetch'
import { Alert } from 'react-native';

const push = () => PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    fetchFromNotificationService(token)
  },

  // (required) Called when a remote or local notification  is opened or received
  onNotification: function(notification) {
    Alert.alert(notification)
    console.log('NOTIFICATION:', notification);

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: 'YOUR GCM (OR FCM) SENDER ID',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: false,
    badge: false,
    sound: false
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true
});

export { push }