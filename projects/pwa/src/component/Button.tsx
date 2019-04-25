import React, { ReactNode } from 'react';
import { metrics } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import { Link } from '@reach/router';

const styles = css`
    padding: ${metrics.baseline}px ${metrics.gutter}px;
    border: 1px solid ${palette.neutral[86]};
    border-radius: 999em;
    display: flex;
    text-decoration: none;
    color: ${palette.neutral[7]};
    font-weight: 500;
`;

const AnchorButton = ({
    children,
    href,
}: {
    children: ReactNode;
    href: string;
}) => (
    <Link to={href} className={styles}>
        {children}
    </Link>
);

export { AnchorButton };
