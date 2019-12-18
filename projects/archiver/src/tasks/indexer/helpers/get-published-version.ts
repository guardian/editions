import { IssuePublicationIdentifier, IssueIdentifier } from '../../../../common'
import {
    getStatuses,
    isPublished,
    IssuePublicationWithStatus,
} from '../../../services/status'
import { Bucket } from '../../../utils/s3'

export const getPublishedVersionInternal = (
    publicationStatuses: IssuePublicationWithStatus[],
    issue: IssueIdentifier,
): IssuePublicationIdentifier | undefined => {
    const published = publicationStatuses.filter(({ status }) =>
        isPublished(status),
    )
    console.log(
        `getPublishedVersion: filtered list of published publications`,
        JSON.stringify(published),
    )

    if (published.length === 0) return undefined

    const chosen = published.reduce((a, b) => (a.updated > b.updated ? a : b))

    // TODO - deleting these seems potentially racey so probably don't need to warn about this
    if (published.length !== 1) {
        console.log(
            `For issue date ${issue.issueDate} of ${issue.edition} we were expecting a single published issue, but received ${published.length}`,
        )
        console.log(JSON.stringify(publicationStatuses))
        console.log(
            `We have chosen to select ${JSON.stringify(
                chosen,
            )} as it has been most recently updated and is in a published state.`,
        )
    }

    return chosen
}

/* Given an edition name and date this will return the current publication instance ID
 * or undefined is there is no valid published instance. This is based on the status
 * of each instance, we are only interested in instances that are 'published'. Of the
 * instances that are valid we want the most recent one.
 * This also logs if there are more than one
 */
export const getPublishedVersion = async (
    issue: IssueIdentifier,
    bucket: Bucket,
): Promise<IssuePublicationIdentifier | undefined> => {
    const publicationStatuses: IssuePublicationWithStatus[] = await getStatuses(
        issue,
        bucket,
    )
    console.log(
        `getPublishedVersion: fetched list of publications for ${JSON.stringify(
            issue,
        )}`,
        JSON.stringify(publicationStatuses),
    )

    return getPublishedVersionInternal(publicationStatuses, issue)
}
