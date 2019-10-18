import { css, html, px } from 'src/helpers/webview'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { breakOut } from '../helpers/layout'
import { CssProps } from '../helpers/css'

export const lineStyles = ({ wrapLayout }: CssProps) => css`
    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        .line {
            position: absolute;
            width: 1px;
            height: '100%';
            background: ${color.line};
            top: 0;
            right: ${breakOut(wrapLayout)};
            bottom: 0;
            display: block;
            z-index: 99999;
        }
    }
`

const Line = ({ zIndex = 9999 }) => {
    return html`
        <div class="line" style="z-index: ${zIndex};"></div>
    `
}

export { Line }
