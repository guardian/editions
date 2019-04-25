import React, { ReactNode } from 'react';
import { boxPadding } from '../helper/styles';
import { css } from 'emotion';

const styles = css`
    ${boxPadding()}
`;

const Content = ({ children }: { children: ReactNode }) => (
    <main className={styles}>{children}</main>
);

export default Content;
