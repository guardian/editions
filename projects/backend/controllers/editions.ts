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

const validateEdition = (edition: any) => {
    const REQUIRED_FIELDS = [
        'title',
        'subTitle',
        'edition',
        'editionType',
        'topic',
    ]
    const editionFields = Object.keys(edition)
    const missingFields = REQUIRED_FIELDS.filter(
        f => !editionFields.includes(f),
    )
    if (missingFields.length > 0) {
        console.error(
            `Editions List is invalid. Missing fields ${missingFields}`,
        )
        return false
    }
    return true
}

export const validateEditionsList = (editionList: any): boolean => {
    if (
        editionList.regionalEditions &&
        editionList.regionalEditions.length >= 2
    ) {
        const validEditions = editionList.regionalEditions.filter(
            validateEdition,
        )
        if (validEditions.length === editionList.regionalEditions.length) {
            return true
        }
    }
    return false
}

const uploadEditionsList = async (list: EditionsList) => {
    const listString = JSON.stringify(list)
    // write to s3 bucket for both proof/store(published)
    await s3Put({ key: 'editions', bucket: 'proof' }, listString)
    await s3Put({ key: 'editions', bucket: 'store' }, listString)
}

export const editionsControllerPost = async (req: Request, res: Response) => {
    const editionsListValid = validateEditionsList(req.body)
    if (editionsListValid) {
        console.log(
            `Edition list parsed successfully: ${JSON.stringify(editionsList)}`,
        )
        try {
            await uploadEditionsList(req.body)
            res.send(
                'Succesfully uploaded editions list to proof and published buckets',
            )
        } catch (error) {
            res.send('Failed to upload to proof/publish S3 buckets')
        }
    } else {
        res.status(400)
        res.send('Editions list invalid')
    }
}
