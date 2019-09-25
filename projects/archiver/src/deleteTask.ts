import { Handler } from 'aws-lambda'
import { IssueSummary } from '../common'
import { deletePublication } from './delete'
import { IndexTaskOutput } from './generateIndexTask'
import { getStatuses } from './status'

const CLEANED = 'cleaned' as const
const CEDED = 'ceded' as const
export type DeletionStatus = typeof CLEANED | typeof CEDED
export type DeleteTaskOutput = Omit<IndexTaskOutput, 'index'> & {
    status: DeletionStatus
    issueSummary: IssueSummary
}
/* This function deletes old versions - it is currently not used
 */
export const handler: Handler<IndexTaskOutput, DeleteTaskOutput> = async ({
    issuePublication,
    issue,
    issueSummary,
}) => {
    const publications = await getStatuses(issuePublication)

    //remove in progress from list
    const unfinished = publications.filter(pub =>
        ['started', 'built'].includes(pub.status),
    )

    if (unfinished.length > 0) {
        console.log('Publications are still in progress, ceding')
        console.log(JSON.stringify(unfinished))
        return {
            issue,
            issuePublication,
            issueSummary,
            status: CEDED,
            message: 'Publications are still in progress, ceding',
        }
    }

    const status = publications.find(
        pub => pub.version === issuePublication.version,
    )

    if (status === undefined) {
        throw new Error('could not find own status')
    }

    const moreRecent = publications.filter(
        pub =>
            pub.status === 'published' &&
            new Date(pub.updated) > new Date(status.updated),
    )
    if (moreRecent.length > 0) {
        console.log('Another version has published more recently, ceding')
        console.log(JSON.stringify(moreRecent))
        return {
            issue,
            issuePublication,
            issueSummary,
            status: CEDED,
            message: 'Another version has published more recently, ceding',
        }
    }

    const safeToDelete = publications.filter(
        ({ version }) => version !== issuePublication.version,
    )
    await Promise.all(safeToDelete.map(deletePublication))
    return {
        issue,
        issuePublication,
        issueSummary,
        status: CLEANED,
        message: `Deleted ${JSON.stringify(safeToDelete)}`,
    }
}
