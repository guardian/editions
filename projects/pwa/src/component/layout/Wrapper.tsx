import React, { ReactNode } from 'react';
import { boxPadding } from '../../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

type StyleProps = {
    border: boolean;
    padding: boolean;
};

const styles = ({ border, padding }: StyleProps) => css`
    ${padding && boxPadding()};
    ${border && `border-bottom: 1px solid ${palette.neutral[86]};`}
    overflow: hidden;
    contain: layout style paint;
`;

const maxWidthStyles = css`
    max-width: 800px;
    margin: auto;
`;

const Wrapper = ({
    children,
    ...styleProps
}: StyleProps & {
    children: ReactNode;
}) => (
    <div className={styles(styleProps)}>
        <div className={maxWidthStyles}>{children}</div>
    </div>
);

Wrapper.defaultProps = {
    border: true,
    padding: true,
};
export default Wrapper;
