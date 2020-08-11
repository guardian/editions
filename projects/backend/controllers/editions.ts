import { Request, Response } from 'express'
import { SpecialEdition, EditionsList } from '../../Apps/common/src'
import { defaultRegionalEditions } from '../../Apps/common/src/editions-defaults'
import { s3Put } from '../s3'

const getSpecialEditions = (): Array<SpecialEdition> => {
    return []
}

const editionsList: EditionsList = {
    regionalEditions: defaultRegionalEditions,
    specialEditions: getSpecialEditions(),
    trainingEditions: [],
}

export const editionsControllerGet = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(editionsList))
}

export const editionsControllerPost = (req: Request, res: Response) => {
    try {
        // TODO: doing simple validation now but would be good to enhance this further
        const editionsList: EditionsList = JSON.parse(JSON.stringify(req.body))
        console.log(`Edition list parsed successfully: ${editionsList}`)

        // write to s3 bucket for both proof/store(published)
        s3Put({ key: 'editions', bucket: 'proof' }, JSON.stringify(req.body))
        s3Put({ key: 'editions', bucket: 'store' }, JSON.stringify(req.body))
        res.send('success')
    } catch (error) {
        console.log('Unable to parse edition list')
        console.error(error)
        res.send('Error: ' + error)
    }
}
