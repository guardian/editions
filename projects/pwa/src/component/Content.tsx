import React, { ReactNode } from 'react';
import styles from './Content.module.css';

const Content = ({ children }: { children: ReactNode }) => (
	<main className={styles.root}>{children}</main>
);

export default Content;
