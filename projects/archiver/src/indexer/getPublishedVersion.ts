import { IssuePublication } from '../../../common/src'
import { getStatuses, publishedStatuses, Status } from '../status'

//This should be used when generating the index file to find the correct publication of an issue.
export const getPublishedVersion = async (
    issue: Omit<IssuePublication, 'version'>,
): Promise<IssuePublication | undefined> => {
    const publications = await getStatuses(issue)
    const published = publications.filter(({ status }) =>
        (publishedStatuses as readonly Status[]).includes(status),
    )

    const chosen = published.reduce((a, b) => (a.updated > b.updated ? a : b))
    if (published.length !== 1) {
        console.log(
            `For issue date ${issue.issueDate} of ${issue.edition} we were expecting a single published issue, but received ${published.length}`,
        )
        console.log(JSON.stringify(publications))
        console.log(
            `We have chosen to select ${JSON.stringify(
                chosen,
            )} as it has been most recently updated and is in a published state.`,
        )
    }
    if (publications.length > 1) {
        console.log('Extra issues found that have not been cleaned')
        console.log(JSON.stringify(publications))
    }
    return chosen
}
