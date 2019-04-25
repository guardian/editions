import React, { ReactNode, Children } from 'react';
import { metrics } from '../../helper/styles';
import { css } from 'emotion';

const styles = css`
    & > * + * {
        margin-top: ${metrics.baseline / 2}px;
    }
`;

// use to evenly space out a list of content
const Rows = ({ children }: { children: ReactNode }) => (
    <ul className={styles}>
        {Children.map(children, child => (
            <li>{child}</li>
        ))}
    </ul>
);

export default Rows;
