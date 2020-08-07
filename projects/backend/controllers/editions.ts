import { Request, Response } from 'express'
import { SpecialEdition, EditionsList } from '../../Apps/common/src'
import { defaultRegionalEditions } from '../../Apps/common/src/editions-defaults'

const getSpecialEditions = (): Array<SpecialEdition> => {
    return []
}

const editionsList: EditionsList = {
    regionalEditions: defaultRegionalEditions,
    specialEditions: getSpecialEditions(),
}

export const editionsController = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(editionsList))
}
