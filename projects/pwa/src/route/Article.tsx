import React from 'react';
import useArticle from '../hooks/useArticle';
import Header from '../component/Header';
import { urlBuilder } from '../helper/urlBuilder';
import Content from '../component/Content';

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
                backLink={{
                    title: `${front} front`,
                    url: urlBuilder({ product, issue, front }),
                }}
            >
                {content ? content.headline : 'loading'}
            </Header>
            <Content>
                {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content.body }}>
                    </div>
                ) : (
                    <div>loading</div>
                )}
            </Content>
        </div>
    );
};

export default Article;
