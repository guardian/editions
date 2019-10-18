import { PillarColours } from '@guardian/pasteup/palette'
import { WrapLayout } from '../../wrap/wrap'
import { ArticleTheme } from '../../types/article'
import { color } from 'src/theme/color'

export interface CssProps {
    colors: PillarColours
    wrapLayout: WrapLayout
    theme: ArticleTheme
}

export const themeColors = (theme: ArticleTheme) => {
    if (theme === ArticleTheme.Dark) {
        return {
            background: color.photoBackground,
            text: color.textOverDarkBackground,
        }
    }

    return {
        background: color.background,
        text: color.text,
    }
}
