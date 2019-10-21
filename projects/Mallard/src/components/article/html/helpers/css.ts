import { PillarColours } from '@guardian/pasteup/palette'
import { ArticleTheme } from '../../types/article'
import { color } from 'src/theme/color'

export interface CssProps {
    colors: PillarColours
    theme: ArticleTheme
}

export const themeColors = (theme: ArticleTheme) => {
    if (theme === ArticleTheme.Dark) {
        return {
            background: color.photoBackground,
            text: color.textOverDarkBackground,
            line: color.line,
            dimText: color.palette.neutral[86],
        }
    }

    return {
        background: color.background,
        text: color.text,
        line: color.line,
        dimText: color.palette.neutral[46],
    }
}
