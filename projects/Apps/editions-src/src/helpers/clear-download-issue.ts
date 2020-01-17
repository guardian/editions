import { prepFileSystem, clearOldIssues, downloadTodaysIssue } from './files'
import { fetchCacheClear } from './fetch'
import ApolloClient from 'apollo-client'
import { cleanPushTrackingByDays } from './push-tracking'

const clearAndDownloadIssue = async (client: ApolloClient<object>) => {
    await prepFileSystem()
    await clearOldIssues()
    await cleanPushTrackingByDays()
    const weOk = await fetchCacheClear()
    if (weOk) {
        return await downloadTodaysIssue(client)
    }
}

export { clearAndDownloadIssue }
