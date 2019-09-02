import { css, html, px, getScaledFontCss } from 'src/helpers/webview'
import { PillarColours } from '@guardian/pasteup/palette'
import { WrapLayout } from '../wrap/wrap'
import { families } from 'src/theme/typography'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { breakOut } from './helpers/layout'
import { Breakpoints } from 'src/theme/breakpoints'

const Quotes = () => html`
    <svg
        class="quotes"
        width="22"
        height="14"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill-rule="evenodd">
            <path
                d="M5.506 0h4.976c-.6 4.549-1.13 9.01-1.36 14H0C.83 9.142 2.557 4.549 5.506 0zM17.093 0H22c-.53 4.549-1.129 9.01-1.36 14h-9.099c.945-4.858 2.604-9.451 5.552-14z"
            />
        </g>
    </svg>
`

const BubblePointer = () => html`
    <svg
        class="bubble"
        width="22"
        height="22"
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M22.007 0l-.033.53c-.273 4.415-1.877 9.35-4.702 13.22-3.74 5.124-9.301 8.115-16.763 8.246L0 22.005V0h22.007z"
            class="line"
            fill="#C70000"
        />
        <path
            d="M1 0v20.982c6.885-.248 11.992-3.063 15.464-7.822 2.593-3.552 4.12-8.064 4.473-12.16.033-.38.037-.72.063-1H1z"
            fill="#FFF"
        />
    </svg>
`

const quoteStyles = ({
    colors,
    wrapLayout,
}: {
    colors: PillarColours
    wrapLayout: WrapLayout
}) => css`
    blockquote {
        box-sizing: border-box;
        border: 1px solid ${colors.main};
        color: ${colors.main};
        border-top-width: 12px;
        padding: 0 1px ${px(metrics.vertical * 2)}
            ${px(metrics.article.sides / 2)};
        position: relative;
        margin-bottom: calc(22px + 0.25em);
        margin-top: 0.25em;
        font-size: 1.1em;
    }

    blockquote svg.bubble {
        position: absolute;
        height: 22px;
        bottom: -22px;
        left: -1px;
    }

    blockquote svg.bubble .line,
    blockquote svg.quotes g {
        fill: ${colors.main};
    }

    blockquote cite {
        font-style: normal;
        font-weight: bold;
        display: block;
    }

    blockquote[data-role='supporting'] {
        font-family: ${families.titlepiece.regular};
    }
    blockquote[data-role='supporting'] cite {
        color: ${color.text};
    }

    @media (max-width: ${px(Breakpoints.tabletVertical)}) {
        blockquote[data-role='inline'],
        blockquote[data-role='supporting'] {
            width: 50%;
            float: left;
            margin-right: ${px(metrics.article.sides)};
        }
    }

    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        blockquote[data-role='inline'],
        blockquote[data-role='supporting'] {
            position: absolute;
            right: ${px(metrics.article.sides)};
            display: block;
            width: ${px(wrapLayout.rail.width)};
        }
    }

    @media (min-width: ${px(Breakpoints.tabletVertical)}) {
        blockquote[data-role='showcase'] {
            width: 50%;
            float: left;
            margin-right: ${px(metrics.article.sides)};
        }
    }

    @media (min-width: ${px(Breakpoints.tabletLandscape)}) {
        blockquote[data-role='showcase'] {
            margin-left: ${px(
                ((Breakpoints.tabletLandscape - wrapLayout.width) / 2 -
                    metrics.article.sides) *
                    -1,
            )};
        }
    }
`

/*
Some quotes have non breakable spaces
so we gotta replace them bc our layout
is hella narrow
*/
const Pullquote = ({
    cite,
    attribution,
    role,
}: {
    cite: string
    role: string
    attribution?: string
}) => html`
    <blockquote data-role=${role}>
        ${Quotes()} ${cite.replace(/\s/g, ' ')}
        ${attribution &&
            html`
                <cite>${attribution}</cite>
            `}
        ${BubblePointer()}
    </blockquote>
`

export { Pullquote, quoteStyles }
