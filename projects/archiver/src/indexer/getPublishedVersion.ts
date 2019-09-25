import {
    IssuePublicationIdentifier,
    IssueIdentifier,
} from '../../../common/src'
import { getStatuses, publishedStatuses, Status } from '../status'

/* Given an edition name and date this will return the current publication instance ID
 * or undefined is there is no valid published instance. This is based on the status
 * of each instance, we are only interested in instances that are 'published'. Of the
 * instances that are valid we want the most recent one.
 * This also logs if there are more than one
 */
export const getPublishedVersion = async (
    issue: IssueIdentifier,
): Promise<IssuePublicationIdentifier | undefined> => {
    const publications = await getStatuses(issue)
    const published = publications.filter(({ status }) =>
        (publishedStatuses as readonly Status[]).includes(status),
    )
    const chosen = published.reduce((a, b) => (a.updated > b.updated ? a : b))

    // TODO - deleting these seems potentially racey so probably don't need to warn about this
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

    return chosen
}
