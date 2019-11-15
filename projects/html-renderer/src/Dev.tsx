import React from 'react'
import styled from 'styled-components'
import { articleTypes } from './model/Article'
import { pillars } from './model/Pillar'

const updateParams = (
    existing: { [key: string]: string },
    updates: { [key: string]: string },
) => {
    const params = new URLSearchParams(existing)
    for (const [key, value] of Object.entries(updates)) {
        params.set(key, value)
    }
    return params
}

const LinkContainer = styled.div`
    position: absolute;
    z-index: 9999;
`

const LinkRow = styled.ul`
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid #aaa;
    list-style: none;
    margin: 0 0 8px;
    padding: 0;
`

const RowTitle = styled.h2`
    background: ${props => props.theme.main};
    padding: 8px;
    color: #fff;
    display: inline-block;
    font-size: 16px;
    font-weight: 400;
    margin: 0 8px 0 0;
`

const LinkWrapper = styled.li`
    display: inline-block;
    margin-right: 8px;
`

const Link = styled.a<{ active?: boolean }>`
    color: black;
    display: inline-block;
    line-height: 1;
    padding: 8px;
    text-decoration: none;

    &:visited {
        color: inherit;
    }

    &:hover,
    &:focus {
        text-decoration: underline;
    }
`

const Dev = ({ params }: { params: { [key: string]: string } }) => (
    <LinkContainer>
        <LinkRow>
            <RowTitle>Types</RowTitle>
            {articleTypes.map(type => (
                <LinkWrapper key={type}>
                    <Link href={`/?${updateParams(params, { type })}`}>
                        {type}
                    </Link>
                </LinkWrapper>
            ))}
        </LinkRow>
        <LinkRow>
            <RowTitle>Pillars</RowTitle>
            {pillars.map(pillar => (
                <LinkWrapper key={pillar}>
                    <Link href={`/?${updateParams(params, { pillar })}`}>
                        {pillar}
                    </Link>
                </LinkWrapper>
            ))}
        </LinkRow>
    </LinkContainer>
)

export { Dev }
