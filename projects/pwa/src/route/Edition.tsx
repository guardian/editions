import React from 'react';
import { Link } from '@reach/router';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Content from '../component/Content';

export interface EditionProps {
    product: string;
    edition: string;
}

const Edition = ({ product, edition }: EditionProps) => {
    return (
        <div>
            <Header
                backLink={{
                    title: `${product} Guardian`,
                    url: urlBuilder(product),
                }}
            >
                {edition} edition
            </Header>
            <Content>
                <ul>
                    <li>
                        <Link to={urlBuilder(product, edition, 'sports')}>
                            Sports front
                        </Link>
                    </li>
                    <li>
                        <Link to={urlBuilder(product, edition, 'lifestyle')}>
                            Lifestyle front
                        </Link>
                    </li>
                </ul>
                <p>{product}</p>
            </Content>
        </div>
    );
};

export default Edition;
