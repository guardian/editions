import React from 'react';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import FrontContainer, { Tile } from '../component/Front';
import Content from '../component/Content';
import Rows from '../component/Rows';

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
                {`${front} front`}
            </Header>
            <FrontContainer>
                <Tile
                    href={urlBuilder({
                        product,
                        issue,
                        front,
                        article: 'otters',
                    })}
                    title={'Otter story'}
                />
                <Tile
                    href={urlBuilder({
                        product,
                        issue,
                        front,
                        article: 'skiing',
                    })}
                    title={'Skiing story'}
                />
                <Tile
                    href={urlBuilder({
                        product,
                        issue,
                        front,
                        article: 'brexit',
                    })}
                    title={'Brexit story'}
                />
                <Tile
                    href={urlBuilder({
                        product,
                        issue,
                        front,
                        article: 'got',
                    })}
                    title={'GoT story'}
                />
            </FrontContainer>
            <Content>
                <Rows>
                    <>{issue}</>
                    <>{product}</>
                </Rows>
            </Content>
        </div>
    );
};

export default Front;
