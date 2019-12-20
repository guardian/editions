import BackgroundFetch from 'react-native-background-fetch'
import { pushTracking } from './push-tracking'
import { clearAndDownloadIssue } from './clear-download-issue'
import ApolloClient from 'apollo-client'

const pushDownloadFailsafe = (client: ApolloClient<object>) => {
    BackgroundFetch.configure(
        {
            minimumFetchInterval: 120, // Every 2 hours
            stopOnTerminate: false,
            startOnBoot: true,
        },
        async () => {
            await pushTracking('backgroundFetch', 'started')
            await clearAndDownloadIssue(client)
            await pushTracking('backgroundFetch', 'ended')
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA)
        },
        error => {
            pushTracking('backgroundFetchError', error.toString())
        },
    )

    const ID = 'backgroundFetchStatus'
    BackgroundFetch.status(status => {
        switch (status) {
            case BackgroundFetch.STATUS_RESTRICTED:
                pushTracking(ID, 'restricted')
                break
            case BackgroundFetch.STATUS_DENIED:
                pushTracking(ID, 'denied')
                break
            case BackgroundFetch.STATUS_AVAILABLE:
                pushTracking(ID, 'enabled')
                break
        }
    })
}

export { pushDownloadFailsafe }
