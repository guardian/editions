import { Issue, IssuePublicationIdentifier } from './common'
import { PublishedIssue } from './fronts/issue'
import { isPreview } from './preview'
import { Path, s3fetch } from './s3'
import { hasFailed } from './utils/try'
import { buildIssueObjectPath } from './utils/issue'

export const getIssue = async (
    issue: IssuePublicationIdentifier,
): Promise<Issue | 'notfound'> => {
    console.log('Attempting to get latest issue for', issue)

    const path: Path = buildIssueObjectPath(issue, isPreview)

    console.log(`Fetching ${JSON.stringify(path)} for ${JSON.stringify(issue)}`)

    const issueData = await s3fetch(path)

    if (hasFailed(issueData)) {
        return 'notfound'
    }

    const data = (await issueData.json()) as PublishedIssue
    const fronts = data.fronts.map((_) => _.name)
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
