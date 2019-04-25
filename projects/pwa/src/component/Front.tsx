import React, { Children, ReactNode } from 'react';
import { Link } from '@reach/router';
import { boxPadding } from '../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

/*
Container for front 'tiles'
*/
const FrontStyle = css`
    display: grid;
    grid-template-columns: 1fr 1fr;

    & > * {
        box-shadow: 0 0 0 1px ${palette.neutral[60]};
    }
`;
const Front = ({ children }: { children: ReactNode }) => (
    <div>
        <ul className={FrontStyle}>
            {Children.map(children, child => (
                <li>{child}</li>
            ))}
        </ul>
    </div>
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
    children: string;
    size: Size;
    href: string;
};

const TileStyle = css`
    display: block;
    ${boxPadding()}
`;
const Tile = ({ children, size, href }: Tile) => (
    <Link to={href} className={TileStyle} data-size={size}>
        <h3>{children}</h3>
    </Link>
);
Tile.defaultProps = {
    size: Size.SmallSquare,
};

export default Front;
export { Tile };
