import React from 'react';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/Header';
import FrontContainer, { Tile } from '../component/Front';

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
            <FrontContainer>
                <Tile
                    href={urlBuilder({
                        product,
                        issue,
                        front,
                        article: 'otters',
                    })}
                >
                    Otter story
                </Tile>
                <Tile
                    href={urlBuilder({
                        product,
                        issue,
                        front,
                        article: 'skiing',
                    })}
                >
                    Skiing story
                </Tile>
            </FrontContainer>
            <ul>
                <li>{issue}</li>
                <li>{product}</li>
            </ul>
        </div>
    );
};

export default Front;
