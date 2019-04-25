import React from 'react';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/layout/Header';
import Wrapper from '../component/layout/Wrapper';
import { AnchorButton } from '../component/Button';
import Rows from '../component/helper/Rows';
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
            <Wrapper>
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
            </Wrapper>
            <Wrapper>
                <Rows>
                    <>{product}</>
                </Rows>
            </Wrapper>
        </div>
    );
};

export default Issue;
