import React, { ReactNode } from 'react';
import { css } from 'emotion';
import { webpageLike } from '../../helper/styles';

const WebpageLikeView = ({ children }: { children: ReactNode }) => (
    <div className={css(webpageLike(true))}>{children}</div>
);

export default WebpageLikeView;
