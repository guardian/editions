import React from 'react';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import { body } from '@guardian/pasteup/typography';

import { metrics } from '../../helper/styles';

// tslint:disable:react-no-dangerous-html
export const textStyle = css`
    strong {
        font-weight: 700;
    }
    p {
        padding: 0 0 ${metrics.baseline}px;
        ${body(2)};
        font-weight: 300;
        word-wrap: break-word;
        color: ${palette.neutral[7]};
    }
    a {
        color: ${palette.news.main};
        text-decoration: none;
        border-bottom: 1px solid ${palette.neutral[86]};
        :hover {
            border-bottom: 1px solid ${palette.news.main};
        }
    }
`;

export const Text: React.FC<{
    html: string;
}> = ({ html }) => (
    <span
        className={textStyle}
        dangerouslySetInnerHTML={{
            __html: html,
        }}
    />
);
