import { Handler } from 'aws-lambda'
import { IssueSummary } from '../common'
import { getIssueSummary } from './indexer/getIssueSummary'
import { indexer } from './indexer/summary'
import { UploadTaskOutput } from './issueUploadTask'
import { upload } from './upload'
import { putStatus, getStatuses } from './status'
import { IndexTaskOutput } from './generateIndexTask'
import { deletePublication } from './delete'

export interface DeleteTaskOutput extends IndexTaskOutput {
    status: 'cleaned' | 'ceded'
    issueSummary: IssueSummary
    index: IssueSummary[]
}
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
        return { issue, issuePublication, issueSummary, status: 'ceded' }
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
        return { issue, issuePublication, issueSummary, status: 'ceded' }
    }

    const safeToDelete = publications.filter(
        ({ version }) => version !== issuePublication.version,
    )
    await Promise.all(safeToDelete.map(deletePublication))
    return { issue, issuePublication, issueSummary, status: 'cleaned' }
}
