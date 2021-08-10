import { Lambda, SharedIniFileCredentials } from 'aws-sdk'
import { awsToString } from '../parser'
import { Atoms } from '@guardian/content-api-models/v1/atoms'
import { Atom } from '@guardian/content-atom-model/atom'
import { ContentAtomElementFields } from '@guardian/content-api-models/v1/contentAtomElementFields'
import { MediaAtom } from '@guardian/content-atom-model/media/mediaAtom'
import { BlockElement } from '../../Apps/common/src'
import { attempt, hasFailed } from '../utils/try'

import { oc } from 'ts-optchain'
import { getImageFromURL } from '../image'

import { getPlatformName } from './consts'

const creds = process.env.arn
    ? {}
    : {
          credentials: new SharedIniFileCredentials({ profile: 'mobile' }),
      }

const lambda = new Lambda({
    region: 'eu-west-1',
    ...creds,
})
export const rationaliseAtoms = (atoms?: Atoms) => ({
    audio: (atoms && atoms.audios) || [],
    chart: (atoms && atoms.charts) || [],
    commonsdivision: (atoms && atoms.commonsdivisions) || [],
    cta: (atoms && atoms.cta) || [],
    explainer: (atoms && atoms.explainers) || [],
    guide: (atoms && atoms.guides) || [],
    interactive: (atoms && atoms.interactives) || [],
    media: (atoms && atoms.media) || [],
    profile: (atoms && atoms.profiles) || [],
    qanda: (atoms && atoms.qandas) || [],
    quiz: (atoms && atoms.quizzes) || [],
    recipe: (atoms && atoms.recipes) || [],
    review: (atoms && atoms.reviews) || [],
    timeline: (atoms && atoms.timelines) || [],
    viewpoint: (atoms && atoms.viewpoints) || [],
})
const renderAtom = async (
    atomType: string,
    atomId: string,
): Promise<{ html?: string; css: string[]; js: string[] }> => {
    const resp = await lambda
        .invoke({
            FunctionName: process.env.atomArn || `editions-atom-renderer-CODE`,
            Payload: JSON.stringify({
                atomType: atomType,
                id: atomId,
            }),
        })
        .promise()

    const payload = awsToString(resp.Payload)
    if (!payload) throw new Error('No response from atom renderer.')
    const result = JSON.parse(JSON.parse(payload)) //FIXME: this is not good.
    return {
        html: result['html'],
        css: result['css'],
        js: result['js'],
    }
}

const posterImageUrl = (mediaAtom: MediaAtom): string | undefined => {
    if (mediaAtom.posterImage && mediaAtom.posterImage.master) {
        return mediaAtom.posterImage.master.file
    }

    return undefined
}

export const renderAtomElement = async (
    data: ContentAtomElementFields | undefined,
    atoms: { [key: string]: Atom[] },
): Promise<BlockElement> => {
    if (data == null) {
        console.error('No atom data found in element.')
        throw new Error('No atom data in element.')
    }

    const atomType = data.atomType
    const atomId = data.atomId
    const atom = (atoms[atomType] || []).find(atom => atom.id === atomId)
    if (atom === undefined) {
        console.error('Atom not found in CAPI response.')
        throw new Error('Atom not found in CAPI response.')
    }
    if (atomType === 'media' && atom !== null && atom.data.kind === 'media') {
        const imageURL = posterImageUrl(atom.data.media)
        const image = getImageFromURL(imageURL)
        const activeVersion64 = atom.data.media.activeVersion
        const activeVersion =
            (activeVersion64 &&
                activeVersion64.buffer &&
                activeVersion64.toNumber()) ||
            -1
        const latestAsset = atom.data.media.assets.find(
            _ => _.version.toNumber() === activeVersion,
        )

        const platform = getPlatformName(oc(latestAsset).platform())
        const assetId = oc(latestAsset).id()
        const title = oc(atom).title('')

        return {
            id: 'media-atom',
            atomId,
            html: atom.defaultHtml,
            image,
            platform,
            assetId,
            title,
        }
    }

    const rendered = await attempt(renderAtom(atomType, atomId))
    if (hasFailed(rendered)) {
        console.warn(`${data.atomType} atom ${data.atomId} removed!`)
        return { id: 'unknown' }
    }
    return {
        id: 'atom',
        atomId,
        atomType: data.atomType,
        ...rendered,
    }
}
