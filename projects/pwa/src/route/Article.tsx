import React from 'react';
import useArticle from '../hooks/useArticle';
import Header, { Appearances } from '../component/Header';
import { urlBuilder } from '../helper/urlBuilder';
import Wrapper from '../component/layout/Wrapper';
import { Elements } from '../component/Elements';

export interface ArticleProps {
    product: string;
    issue: string;
    front: string;
    article: string;
}

const Article = ({ product, issue, front, article }: ArticleProps) => {
    const content = useArticle(front, article);
    return (
        <div>
            <Header
                appearance={Appearances.White}
                backLink={{
                    title: `${front} front`,
                    url: urlBuilder({ product, issue, front }),
                }}
            >
                {content ? content.headline : 'loading'}
            </Header>
            <Wrapper border>
                {content ? (
                    <Elements elements={content.elements} />
                ) : (
                    <div>loading</div>
                )}
            </Wrapper>
        </div>
    );
};

export default Article;
