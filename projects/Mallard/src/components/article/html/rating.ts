import { PillarColours } from '@guardian/pasteup/palette'
import { getRatingAsText } from 'src/components/stars/stars'
import { css, html, px } from 'src/helpers/webview'
import { families } from 'src/theme/typography'
import { WrapLayout } from '../wrap/wrap'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

export const ratingStyles = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config: {
        colors: PillarColours
        wrapLayout: WrapLayout
    },
) => css`
    .rating {
        font-family: ${families.icon.regular};
        background-color: ${color.palette.highlight.main};
        padding: 0 ${px(metrics.horizontal / 3)} ${px(7)};
        line-height: 1;
        font-size: 1.2em;
    }
`

const Rating = ({ starRating = 3.5 }) => {
    return html`
        <div class="rating" aria-label="${starRating} stars">
            ${getRatingAsText(starRating).join('')}
        </div>
    `
}

export { Rating }
