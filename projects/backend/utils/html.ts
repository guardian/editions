import striptags from 'striptags'

const cleanupHtml = (input: string) => {
    if (!input) return input
    const withLineBreaks = striptags(input, ['br', 'p'])
    return striptags(withLineBreaks, [], '\n').replace(/^ */gm, '')
}

export { cleanupHtml }
