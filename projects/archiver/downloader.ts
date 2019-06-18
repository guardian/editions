import fetch from 'node-fetch'
import { Issue, Front, Collection } from './common'
const URL = 'https://d2cf1ljtg904cv.cloudfront.net'

export const getIssue = async (id: string) => {
    console.log('fetching!', `${URL}/issue/${id}`)

    const response = await fetch(`${URL}/issue/${id}`)
    console.log(response.status)
    const json = await response.json()
    console.log(json)
    return json as Issue
}

export const getFront = async (id: string) => {
    const response = await fetch(`${URL}/front/${id}`)
    return (await response.json()) as Front
}

export const getCollection = async (id: string) => {
    const response = await fetch(`${URL}/collection/${id}`)
    return (await response.json()) as Collection
}
