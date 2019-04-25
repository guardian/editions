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

type Props = {
    title: string;
    size: Size;
    href: string;
};

const style = css`
    display: block;
    &:hover {
        background: ${palette.neutral[97]};
    }
    ${resetLink()}
    ${boxPadding()}
`;

const titleStyle = css`
    ${headline(2)};
    font-weight: 700;
`;

const Tile = ({ title, size, href }: Props) => (
    <Link to={href} className={style} data-size={size}>
        <h3 className={titleStyle}>{title}</h3>
    </Link>
);
Tile.defaultProps = {
    size: Size.SmallSquare,
};

export { Tile };
