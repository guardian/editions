import ApolloClient from 'apollo-client'
import { todayAsKey } from 'src/helpers/issues'
import { getIssueSummary } from 'src/hooks/use-issue-summary'
import { matchSummmaryToKey, isIssueOnDevice } from 'src/helpers/files'
import { imageForScreenSize } from 'src/helpers/screen'
import { errorService } from 'src/services/errors'
import { downloadAndUnzipEdition } from './download-and-unzip'

const downloadTodaysEdition = async (client: ApolloClient<object>) => {
    const todaysKey = todayAsKey()
    try {
        const issueSummaries = await getIssueSummary()

        // Find the todays issue summary from the list of summary
        const todaysIssueSummary = matchSummmaryToKey(issueSummaries, todaysKey)

        // If there isnt one for today, then fahgettaboudit...
        if (!todaysIssueSummary) return null

        const isTodaysIssueOnDevice = await isIssueOnDevice(
            todaysIssueSummary.localId,
        )

        // Only download it if its not on the device
        if (!isTodaysIssueOnDevice) {
            const imageSize = await imageForScreenSize()
            return downloadAndUnzipEdition(
                client,
                todaysIssueSummary,
                imageSize,
            )
        }
    } catch (e) {
        e.message = `Unable to download todays issue: ${e.message}`
        errorService.captureException(e)
        console.log(e.message)
    }
}

export { downloadTodaysEdition }
