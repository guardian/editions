import React, { ReactNode } from 'react';
import { css } from 'emotion';

const styles = css`
	padding: 0.5em 1em 1em;
`;

const Content = ({ children }: { children: ReactNode }) => (
	<main className={styles}>{children}</main>
);

export default Content;
