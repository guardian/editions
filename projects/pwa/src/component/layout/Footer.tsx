import React from 'react';
import { css } from 'emotion';
import Wrapper from './Wrapper';

const styles = css`
    font-size: 0.75em;
`;

const Footer = () => (
    <Wrapper border={false}>
        <footer className={styles}>
            &copy;{new Date().getFullYear()} Guardian News & Media
        </footer>
    </Wrapper>
);

export default Footer;
