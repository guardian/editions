import { prepFileSystem, clearOldIssues, downloadTodaysIssue } from './files'
import { fetchCacheClear } from './fetch'

const clearAndDownloadIssue = async () => {
    await prepFileSystem()
    await clearOldIssues()
    const weOk = await fetchCacheClear()
    if (weOk) {
        return await downloadTodaysIssue()
    } else {
        return Promise.resolve()
    }
}

export { clearAndDownloadIssue }
