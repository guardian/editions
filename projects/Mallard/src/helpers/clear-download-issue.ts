import { prepFileSystem, clearOldIssues, downloadTodaysIssue } from './files'
import { fetchCacheClear } from './fetch'
import ApolloClient from 'apollo-client'

const clearAndDownloadIssue = async (client: ApolloClient<object>) => {
    await prepFileSystem()
    await clearOldIssues()
    const weOk = await fetchCacheClear()
    if (weOk) {
        return await downloadTodaysIssue(client)
    }
}

export { clearAndDownloadIssue }
