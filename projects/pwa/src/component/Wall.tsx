import React, { Children, ReactNode } from 'react';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import { Tile } from './wall/Tile';

/*
Container for front 'tiles'
*/
const style = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1fr;
    grid-gap: 1px;
    background: ${palette.neutral[86]};
    padding: 1px;
    margin: -1px;
    > * {
        background: ${palette.neutral[100]};
    }
`;
const liStyle = css`
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
const Wall = ({ children }: { children: ReactNode }) => (
    <ul className={style}>
        {Children.map(children, child => (
            <li className={liStyle}>{child}</li>
        ))}
    </ul>
);

export default Wall;
export { Tile };
