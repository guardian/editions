import { Request, Response } from 'express'
import { lastModified } from '../lastModified'
import { getFront, getCollection } from '../fronts'

export const frontController = (req: Request, res: Response) => {
    const id: string = req.params[0]
    const [date, updater] = lastModified()

    getFront(id, updater)
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

export const collectionsController = (req: Request, res: Response) => {
    const id: string = req.params.collectionId
    const [date, updater] = lastModified()

    getCollection(id, true, updater)
        .then(data => {
            res.setHeader('Last-Modifed', date())
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(error => {
            console.error('Error in the collections controller.')
            console.error(error)
            res.sendStatus(500)
        })
}
