import React, { ReactNode } from 'react';
import { Link } from '@reach/router';
import { css } from 'emotion';

export type BackLink = {
    title: string;
    url: string;
};

const styles = css`
    padding: 0.5em 1em 1em;
    background: darkblue;
    color: #fff;

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
