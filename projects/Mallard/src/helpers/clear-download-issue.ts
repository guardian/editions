import ApolloClient from 'apollo-client'
import { pushDownloadFailsafe } from 'src/helpers/push-download-failsafe'
import { fetchCacheClear } from './fetch'
import { clearOldIssues, downloadTodaysIssue, prepFileSystem } from './files'
import { cleanPushTrackingByDays } from './push-tracking'
import { largeDeviceMemory } from 'src/hooks/use-config-provider'

const clearAndDownloadIssue = async (client: ApolloClient<object>) => {
    await prepFileSystem()
    await clearOldIssues()
    await cleanPushTrackingByDays()
    const weOk = await fetchCacheClear()
    if (weOk) {
        // Check to see if the device has a decent amount of memory before doing intensive tasks
        const largeRAM = await largeDeviceMemory()
        if (largeRAM) {
            pushDownloadFailsafe(client)
            return await downloadTodaysIssue(client)
        }
        return
    }
}

export { clearAndDownloadIssue }
