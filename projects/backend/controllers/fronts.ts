import { Request, Response } from 'express'
import { lastModified } from '../lastModified'
import { getCollectionsForFront, getCollection } from '../fronts'

export const frontController = (req: Request, res: Response) => {
    const id: string = req.params[0]
    const [date, updater] = lastModified()

    getCollectionsForFront(id, updater).then(data => {
        res.setHeader('Last-Modifed', date())
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
}

export const collectionsController = (req: Request, res: Response) => {
    const id: string = req.params.collectionId
    const [date, updater] = lastModified()

    getCollection(id, updater).then(data => {
        res.setHeader('Last-Modifed', date())
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
}
