import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Content from '../component/Content';

export interface FrontProps {
    product: string;
    issue: string;
    front: string;
}

const Front = ({ product, issue, front }: FrontProps) => {
    return (
        <div>
            <Header
                backLink={{
                    title: `${issue} issue`,
                    url: urlBuilder({ product, issue }),
                }}
            >
                {front} Front
            </Header>
            <Content>
                <ul>
                    <li>
                        <Link
                            to={urlBuilder({
                                product,
                                issue,
                                front,
                                article: 'otters',
                            })}
                        >
                            Otter story
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={urlBuilder({
                                product,
                                issue,
                                front,
                                article: 'skiing',
                            })}
                        >
                            Skiing story
                        </Link>
                    </li>
                </ul>
                <p>{issue}</p>
                <p>{product}</p>
            </Content>
        </div>
    );
};

export default Front;
