import React from 'react';
import { Link } from '@reach/router';
import { boxPadding, resetLink } from '../../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import { headline } from '@guardian/pasteup/typography';

/*
Front 'tiles' themselves
*/

enum Size {
    SmallSquare,
    Square,
    LongSquare,
}

type Tile = {
    title: string;
    size: Size;
    href: string;
};

const tileStyle = css`
    display: block;
    &:hover {
        background: ${palette.neutral[97]};
    }
    ${resetLink()}
    ${boxPadding()}
`;

const tileTitleStyle = css`
    ${headline(2)};
    font-weight: 700;
`;

const Tile = ({ title, size, href }: Tile) => (
    <Link to={href} className={tileStyle} data-size={size}>
        <h3 className={tileTitleStyle}>{title}</h3>
    </Link>
);
Tile.defaultProps = {
    size: Size.SmallSquare,
};

export { Tile };
