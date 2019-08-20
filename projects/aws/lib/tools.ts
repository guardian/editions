export const toTitleCase = (input: string) =>
    input
        .split('-')
        .map(
            segment =>
                `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}}`,
        )
        .join('')
