import React, { ReactNode } from 'react';
import { Link } from '@reach/router';
import styles from './Header.module.css';

export type BackLink = {
    title: string;
    url: string;
};

const Header = ({
    backLink,
    children,
}: {
    backLink?: BackLink;
    children: ReactNode;
}) => (
    <header className={styles.root}>
        {backLink && <Link to={backLink.url}>Return to {backLink.title}</Link>}
        <h1>{children}</h1>
    </header>
);

export default Header;
