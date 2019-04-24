import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Content from '../component/Content';

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
                {issue} issue
            </Header>
            <Content>
                <ul>
                    <li>
                        <Link
                            to={urlBuilder({ product, issue, front: 'sports' })}
                        >
                            Sports front
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={urlBuilder({
                                product,
                                issue,
                                front: 'lifestyle',
                            })}
                        >
                            Lifestyle front
                        </Link>
                    </li>
                </ul>
                <p>{product}</p>
            </Content>
        </div>
    );
};

export default Issue;
