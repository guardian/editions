import { Request, Response } from 'express'
import { Issue } from '../common'
import { lastModified } from '../lastModified'
import fetch from 'node-fetch'
import { Crossword } from '@guardian/capi-ts'
import moment from 'moment'
import console = require('console');


const crosswordDateParamFormat: string = 'YYYY-MM-DD'
const crosswordApiKey: string | undefined = process.env.CROSSWORD_API_KEY || undefined

const crossswordApiUrl = (date: string, crosswordApiKey: string) => `https://x-puzzle-hrd.appspot.com/api/crosswords/${date}.json?api-key=${crosswordApiKey}`

const getCrossword = async (
    date: string,
): Promise<Crossword | 'notfound' | 'notallowed'> => {
    if (!crosswordApiKey) throw new Error('Invalid API key')    

    const crosswordReponse = await fetch(`${crossswordApiUrl(date, crosswordApiKey)}`)
    if (crosswordReponse.status === 405) return 'notallowed'
    if (crosswordReponse.status === 404) return 'notfound'
    if (!crosswordReponse.ok) throw new Error('Something went wrong')

    return crosswordReponse.json().then(res => ({ ...res })) as Promise<Crossword>
}

export const crosswordController = (req: Request, res: Response) => {
    const date: string = req.params.date
    if (!moment(date, crosswordDateParamFormat, true).isValid()) throw new Error(`Invalid date: Date must be in format ${crosswordDateParamFormat}`)

    getCrossword(date)
        .then(data => {
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}
