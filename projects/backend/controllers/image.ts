import { Request, Response } from 'express'
import { getRedirect } from '../image'
export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    const path: string = req.params[0]
    const redirect = getRedirect(source, size, path)
    res.redirect(redirect)
}
