import { PillarColours } from '@guardian/pasteup/palette'
import { css, html, px } from 'src/helpers/webview'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { WrapLayout } from '../wrap/wrap'
import { breakOut } from './helpers/layout'

export const lineStyles = ({
    wrapLayout,
}: {
    colors: PillarColours
    wrapLayout: WrapLayout
}) => css`
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
