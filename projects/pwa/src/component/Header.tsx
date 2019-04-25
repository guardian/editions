import React, { ReactNode } from 'react';
import { Link } from '@reach/router';
import { boxPadding } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

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

const Header = ({
    backLink,
    children,
}: {
    backLink?: BackLink;
    children: ReactNode;
}) => (
    <header className={styles}>
        {backLink && <Link to={backLink.url}>Return to {backLink.title}</Link>}
        <h1>{children}</h1>
    </header>
);

export default Header;
