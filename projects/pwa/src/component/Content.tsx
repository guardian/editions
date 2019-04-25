import React, { ReactNode } from 'react';
import { boxPadding } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

const styles = css`
    ${boxPadding()};
    border-bottom: 1px solid ${palette.neutral[86]};
`;

const Content = ({ children }: { children: ReactNode }) => (
    <main className={styles}>{children}</main>
);

export default Content;
