import { ArticleHeaderProps } from '../header'
import { HeaderType } from 'src/common'

const getByLineText = (
    headerType: HeaderType,
    headerProps: ArticleHeaderProps,
): string | undefined => {
    const byLineText =
        headerType === HeaderType.NoByline ||
        headerType === HeaderType.LargeByline
            ? headerProps.standfirst
            : headerProps.bylineHtml
    if (!byLineText) return undefined

    const newLineCheck = byLineText.split('</a>')
    // Link at the end? No new line needed
    if (newLineCheck[newLineCheck.length - 1] === '') {
        return byLineText
    }

    const bylineWithNewLine = byLineText.replace(
        `</a>${newLineCheck[newLineCheck.length - 1]}`,
        `</a><br />${newLineCheck[newLineCheck.length - 1]}`,
    )
    return bylineWithNewLine
}

export { getByLineText }
