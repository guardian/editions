import { Request, Response } from 'express'
import { lastModified } from '../lastModified'
import { getFront } from '../fronts'

export const frontController = (req: Request, res: Response) => {
    const id: string = req.params[0]
    const issue: string = req.params.issueId
    const [date, updater] = lastModified()
    console.log(`Request for ${req.url} fetching front ${id}`)
    getFront(issue, id, updater)
        .then(data => {
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
