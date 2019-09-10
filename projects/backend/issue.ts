import { Issue } from './common'
import { IssuePublication } from './controllers/issue'
import { PublishedIssue } from './fronts/issue'
import { isPreview } from './preview'
import { Path, s3fetch } from './s3'
import { hasFailed } from './utils/try'

export const getIssue = async (
    issue: IssuePublication,
): Promise<Issue | 'notfound'> => {
    console.log('Attempting to get latest issue for', issue)
    const path: Path = {
        key: `${issue.edition}/${issue.issueDate}/${issue.version}.json`,
        bucket: isPreview ? 'preview' : 'published',
    }

    console.log(`Fetching ${JSON.stringify(path)} for ${JSON.stringify(issue)}`)

    const issueData = await s3fetch(path)

    if (hasFailed(issueData)) {
        return 'notfound'
    }

    const data = (await issueData.json()) as PublishedIssue
    const fronts = data.fronts.map(_ => _.name)
    const key = `${issue.edition}/${issue.issueDate}`
    const publishedId = `${key}/${issue.version}`
    const localId = key

    return {
        name: data.name,
        key,
        localId,
        publishedId,
        date: data.issueDate,
        fronts,
    }
}
