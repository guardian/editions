import BackgroundFetch from 'react-native-background-fetch'
import { pushTracking } from '../push-notifications/push-tracking'
import ApolloClient from 'apollo-client'
import { Feature } from 'src/services/logging'
import { prepareAndDownloadTodaysIssue } from 'src/download-edition/prepare-and-download-issue'

const feature = Feature.BACKGROUNG_DOWNLOAD

const pushDownloadFailsafe = (client: ApolloClient<object>) => {
    BackgroundFetch.configure(
        {
            minimumFetchInterval: 120, // Every 2 hours
            stopOnTerminate: false,
            startOnBoot: true,
        },
        async () => {
            await pushTracking('backgroundFetch', 'started', feature)
            await prepareAndDownloadTodaysIssue(client)
            await pushTracking('backgroundFetch', 'ended', feature)
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA)
        },
        error => {
            pushTracking('backgroundFetchError', error.toString(), feature)
        },
    )

    const ID = 'backgroundFetchStatus'
    BackgroundFetch.status(status => {
        switch (status) {
            case BackgroundFetch.STATUS_RESTRICTED:
                pushTracking(ID, 'restricted', feature)
                break
            case BackgroundFetch.STATUS_DENIED:
                pushTracking(ID, 'denied', feature)
                break
            case BackgroundFetch.STATUS_AVAILABLE:
                pushTracking(ID, 'enabled', feature)
                break
        }
    })
}

export { pushDownloadFailsafe }
