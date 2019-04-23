import React, { ReactNode } from 'react';
import { Link } from '@reach/router';

const Header = ({
	backLink,
	children,
}: {
	backLink?: string;
	children: ReactNode;
}) => (
	<header>
		{backLink && <Link to={backLink}>Return to {backLink}</Link>}
		<h1>{children}</h1>
	</header>
);

export default Header;
