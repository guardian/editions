import React from 'react';
import { Link } from '@reach/router';
import { boxPadding, metrics } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import usePageTitle from '../hooks/usePageTitle';

export type BackLink = {
    title: string;
    url: string;
};

const styles = css`
    ${boxPadding()}
    background: ${palette.brand.main};
    color: ${palette.neutral[100]};

    a {
        color: inherit;
    }
`;

const headerStyles = css`
    font-size: 2em;
    margin-top: ${metrics.baseline}px;
`;

const Header = ({
    backLink,
    children,
}: {
    backLink?: BackLink;
    children: string;
}) => {
    usePageTitle(children);
    return (
        <header className={styles}>
            {backLink && (
                <Link to={backLink.url}>← Return to {backLink.title}</Link>
            )}
            <h1 className={headerStyles}>{children}</h1>
        </header>
    );
};

export default Header;
