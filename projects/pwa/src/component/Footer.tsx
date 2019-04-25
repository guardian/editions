import React from 'react';
import { boxPadding } from '../helper/styles';
import { css } from 'emotion';

const styles = css`
    ${boxPadding()};
    font-size: 0.75em;
`;

const Footer = () => (
    <footer className={styles}>
        &copy;{new Date().getFullYear()} Guardian news & media
    </footer>
);

export default Footer;
