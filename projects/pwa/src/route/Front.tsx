import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Content from '../component/Content';

export interface FrontProps {
    product: string;
    edition: string;
    front: string;
}

const Front = ({ product, edition, front }: FrontProps) => {
    return (
        <div>
            <Header
                backLink={{
                    title: `${edition} edition`,
                    url: urlBuilder(product, edition),
                }}
            >
                {front} Front
            </Header>
            <Content>
                <ul>
                    <li>
                        <Link
                            to={urlBuilder(product, edition, front, 'otters')}
                        >
                            Otter story
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={urlBuilder(product, edition, front, 'skiing')}
                        >
                            Skiing story
                        </Link>
                    </li>
                </ul>
                <p>{edition}</p>
                <p>{product}</p>
            </Content>
        </div>
    );
};

export default Front;
