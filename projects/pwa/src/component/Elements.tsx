import React from 'react';
import { css } from 'emotion';
import { Text } from './elements/Text';
import WebpageLikeView from './helper/WebpageLikeView';

const clear = css`
    clear: both;
`;

export const Elements: React.FC<{
    elements: CAPIElement[];
}> = ({ elements }) => {
    const output = elements.map((element, i) => {
        switch (element._type) {
            case 'model.dotcomrendering.pageElements.TextBlockElement':
                return <Text key={i} html={element.html} />;
            default:
                return null;
        }
    });

    return (
        <WebpageLikeView>
            {output}
            <div className={clear} />
        </WebpageLikeView>
    );
};
