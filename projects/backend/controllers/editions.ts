import { Request, Response } from 'express'
import { SpecialEdition } from '../../Apps/common/src'
import { defaultRegionalEditions } from '../../Apps/common/src/editions-defaults'

const getSpecialEditions = (): Array<SpecialEdition> => {
    return []
}

export const editionsController = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(
        JSON.stringify({
            regionalEditions: defaultRegionalEditions,
            specialEditions: getSpecialEditions(),
        }),
    )
}
