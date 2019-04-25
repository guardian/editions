import React, { ReactNode } from 'react';
import { boxPadding } from '../../helper/styles';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

/*
Use this for anything that touches the edges of the page. 
If you need a functionality once, wrap it in a div in your 
implementation. If you need a feature more than once, add it as a prop!
*/
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
    padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left);
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
