import React from 'react';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import Wrapper from '../component/layout/Wrapper';
import { AnchorButton } from '../component/Button';
import Rows from '../component/layout/Rows';

export interface ProductProps {
    product: string;
}

const Product = ({ product }: ProductProps) => {
    return (
        <div>
            <Header>{`${product} Guardian`}</Header>
            <Wrapper border>
                <Rows>
                    <AnchorButton
                        href={urlBuilder({ product, issue: 'saturday' })}
                    >
                        Saturday issue
                    </AnchorButton>
                    <AnchorButton
                        href={urlBuilder({ product, issue: 'sunday' })}
                    >
                        Sunday issue
                    </AnchorButton>
                </Rows>
            </Wrapper>
        </div>
    );
};

export default Product;
