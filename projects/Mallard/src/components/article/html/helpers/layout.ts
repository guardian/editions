import { WrapLayout } from '../../wrap/wrap'
import { css, px } from 'src/helpers/webview'
import { metrics } from 'src/theme/spacing'

export const breakOut = (l: WrapLayout) =>
    l.width - l.content.width - metrics.sides.sides / 2

export const breakSides = css`
    margin-left: ${px(metrics.article.sidesTablet * -1)};
    padding-left: ${px(metrics.article.sidesTablet)};
    margin-right: ${px(metrics.article.sidesTablet * -1)};
    padding-right: ${px(metrics.article.sidesTablet)};
`
