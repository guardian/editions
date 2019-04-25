import React from 'react';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Content from '../component/Content';
import { AnchorButton } from '../component/Button';
import Rows from '../component/Rows';
export interface IssueProps {
    product: string;
    issue: string;
}

const Issue = ({ product, issue }: IssueProps) => {
    return (
        <div>
            <Header
                backLink={{
                    title: `${product} Guardian`,
                    url: urlBuilder({ product }),
                }}
            >
                {`${issue} issue`}
            </Header>
            <Content>
                <Rows>
                    <AnchorButton
                        href={urlBuilder({
                            product,
                            issue,
                            front: 'sports',
                        })}
                    >
                        Sports front
                    </AnchorButton>
                    <AnchorButton
                        href={urlBuilder({
                            product,
                            issue,
                            front: 'lifestyle',
                        })}
                    >
                        Lifestyle front
                    </AnchorButton>
                </Rows>
            </Content>
            <Content>
                <Rows>
                    <>{product}</>
                </Rows>
            </Content>
        </div>
    );
};

export default Issue;
