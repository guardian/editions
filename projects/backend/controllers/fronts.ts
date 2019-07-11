import { Request, Response } from 'express'
import { lastModified } from '../lastModified'
import { getFront } from '../fronts'
import { hasFailed } from '../utils/try'

export const frontController = (req: Request, res: Response) => {
    const id: string = req.params[0]
    const issue: string = req.params.issueId
    const [date, updater] = lastModified()
    console.log(`Request for ${req.url} fetching front ${id}`)
    getFront(issue, id, updater)
        .then(data => {
            if (hasFailed(data)) {
                console.error(`${req.url} threw ${JSON.stringify(data)}`)
                if (data.httpStatus) res.sendStatus(data.httpStatus)
                res.sendStatus(500)
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
