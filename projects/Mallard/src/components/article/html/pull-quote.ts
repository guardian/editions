import { css, html } from 'src/helpers/webview'
import { PillarColours } from '@guardian/pasteup/palette'
import { WrapLayout } from '../wrap/wrap'

const BubblePointer = () => html`
    <svg
        width="22px"
        height="22px"
        viewBox="0 0 22 22"
        version="1.1"
        role="img"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
    >
        <path
            d="M22.0069452,2.84217094e-14 L21.9741484,0.530833017 C21.7014014,4.94538553 20.0967547,9.87927122 17.2719958,13.749734 C13.5328381,18.873778 7.9707356,21.8649703 0.50877333,21.995923 L0,22.0048517 L0,2.84217094e-14 L22.0069452,2.84217094e-14 Z"
            class="line"
            fill="#C70000"
        ></path>
        <path
            d="M1,2.84217094e-14 L1,20.9824612 C7.8854742,20.7340818 12.9916017,17.9190296 16.4642228,13.1602405 C19.0568549,9.6078359 20.5839444,5.09622634 20.9367614,1 C20.9695216,0.61965136 20.9741472,0.279980645 21,2.84217094e-14 L1,2.84217094e-14 Z"
            fill="#FFFFFF"
        ></path>
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
        border: 1px solid ${colors.main};
        color: ${colors.main};
        border-top-width: 12px;
        padding: 6px;
        position: relative;
        margin-bottom: calc(22px + 1rem);
    }

    blockquote svg {
        position: absolute;
        height: 22px;
        bottom: -22px;
        left: -1px;
    }

    blockquote svg .line {
        fill: ${colors.main};
    }

    blockquote cite {
        font-style: normal;
        font-weight: bold;
    }
`

const Pullquote = ({
    cite,
    attribution,
}: {
    cite: string
    role: string
    attribution?: string
}) => html`
    <blockquote>
        ${cite}${attribution &&
            html`
                <cite>${attribution}</cite>
            `}
        ${BubblePointer()}
    </blockquote>
`

export { Pullquote, quoteStyles }
