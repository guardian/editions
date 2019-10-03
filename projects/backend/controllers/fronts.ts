import { Request, Response } from 'express'
import { lastModified } from '../lastModified'
import { getFront } from '../fronts'
import { hasFailed } from '../utils/try'
import { isPreview } from '../preview'

export const frontController = (req: Request, res: Response) => {
    const frontId: string = req.params[0]
    const issueDate: string = req.params.date
    const version: string = decodeURIComponent(
        isPreview ? 'preview' : req.params.version,
    )

    const edition = req.params.edition
    const [date, updater] = lastModified()
    console.log(`Request for ${req.url} fetching front ${frontId}`)
    getFront(edition, issueDate, frontId, version, updater)
        .then(data => {
            if (hasFailed(data)) {
                console.error(`${req.url} threw ${JSON.stringify(data)}`)
                if (data.httpStatus) {
                    res.sendStatus(data.httpStatus)
                } else {
                    res.sendStatus(500)
                }
                return
            }
            res.setHeader('Last-Modifed', date())
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(error => {
            console.error('Error in the fronts controller.')
            console.error(error)
            res.sendStatus(500)
        })
}
