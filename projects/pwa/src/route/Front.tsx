import React from 'react';
import { urlBuilder } from '../helper/urlBuilder';
import Header from '../component/layout/Header';
import Wall, { Tile } from '../component/Wall';
import Wrapper from '../component/layout/Wrapper';
import Rows from '../component/helper/Rows';

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
            <Wrapper padding={false}>
                <Wall>
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
                </Wall>
            </Wrapper>
            <Wrapper>
                <Rows>
                    <>{issue}</>
                    <>{product}</>
                </Rows>
            </Wrapper>
        </div>
    );
};

export default Front;
