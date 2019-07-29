import { LastModifiedUpdater } from './lastModified'
import { Issue } from './common'
import { hasFailed } from './utils/try'
import { s3fetch, Path } from './s3'
import { PublishedIssue } from './fronts/issue'
import { isPreview } from './preview'

export const getIssue = async (
    issue: string,
    source: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Issue | 'notfound'> => {
    console.log('Attempting to get latest issue for', issue)
    const path: Path = {
        key: `daily-edition/${issue}/${source}.json`,
        bucket: isPreview ? 'preview' : 'published',
    }

    console.log(`Fetching ${JSON.stringify(path)} for ${issue}`)

    const issueData = await s3fetch(path)

    if (hasFailed(issueData)) {
        return 'notfound'
    }

    lastModifiedUpdater(issueData.lastModified)
    const data = (await issueData.json()) as PublishedIssue
    const fronts = data.fronts.map(_ => _.name)
    return {
        name: data.name,
        key: issue,
        id: data.id,
        date: data.issueDate,
        fronts,
    }
}
