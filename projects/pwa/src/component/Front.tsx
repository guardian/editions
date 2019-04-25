import React, { Children, ReactNode } from 'react';
import { Link } from '@reach/router';

/*
Container for front 'tiles'
*/

const Front = ({ children }: { children: ReactNode }) => (
    <div className="front">
        <ul>
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

const Tile = ({ children, size, href }: Tile) => (
    <Link to={href} className="tile" data-size={size}>
        <h3>{children}</h3>
    </Link>
);
Tile.defaultProps = {
    size: Size.SmallSquare,
};

export default Front;
export { Tile };
