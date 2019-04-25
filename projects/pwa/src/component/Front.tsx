import React, { Children, ReactNode } from 'react';
import { Link } from '@reach/router';
import { boxPadding } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

/*
Container for front 'tiles'
*/
const frontStyle = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1fr;
    grid-gap: 1px;
    background: ${palette.neutral[86]};
    border-bottom: 1px solid ${palette.neutral[86]};
    > * {
        background: ${palette.neutral[100]};
    }
`;
const frontLiStyle = css`
    padding-top: 100%;
    width: 100%;
    position: relative;
    > * {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
`;
const Front = ({ children }: { children: ReactNode }) => (
    <ul className={frontStyle}>
        {Children.map(children, child => (
            <li className={frontLiStyle}>{child}</li>
        ))}
    </ul>
);

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
    ${boxPadding()}
`;
const Tile = ({ title, size, href }: Tile) => (
    <Link to={href} className={tileStyle} data-size={size}>
        <h3>{title}</h3>
    </Link>
);
Tile.defaultProps = {
    size: Size.SmallSquare,
};

export default Front;
export { Tile };
