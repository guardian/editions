import React from 'react'
import styled from 'styled-components'
import { PullquoteEl } from '../model/Article'
import { Quote } from './Quote'

const Attrib = styled.cite`
    font-style: normal;
    font-weight: bold;
    display: block;
`

const Blockquote = styled.blockquote`
    box-sizing: border-box;
    border: 1px solid ${props => props.theme.main};
    color: ${props => props.theme.main};
    border-top-width: 12px;
    padding: 4px 1px 8px 8px;
    position: relative;
    line-height: 1.2;
    margin: 0;
    margin-bottom: calc(22px + 0.25em);
    margin-top: 0.25em;
    font-size: 1.1em;
    hyphens: auto;
    z-index: 10000;
`

const InlineQuote = styled(Blockquote)`
    @media (max-width: 1000px) {
        width: 50%;
        float: left;
        margin-right: 8px;
    }

    @media (min-width: 1000px) {
        position: absolute;
        left: 100%;
        display: block;
        width: 180px;
    }
`

const SupportingQuote = styled(InlineQuote)`
    font-family: GT Guardian Titlepiece;

    ${Attrib} {
        color: #111;
    }
`

const ShowcaseQuote = styled(Blockquote)`
    @media (min-width: 1000px) {
        width: 60%;
        float: left;
        margin-right: 8px;
    }
`

const TailWrapper = styled.svg`
    left: -1px;
    height: 22px;
    position: absolute;
    top: 100%;
    width: 22px;
`

const Line = styled.path`
    fill: ${props => props.theme.main};
`

const Tail = () => (
    <TailWrapper aria-hidden role="img">
        <Line d="M22.007 0l-.033.53c-.273 4.415-1.877 9.35-4.702 13.22-3.74 5.124-9.301 8.115-16.763 8.246L0 22.005V0h22.007z" />
        <path
            d="M1 0v20.982c6.885-.248 11.992-3.063 15.464-7.822 2.593-3.552 4.12-8.064 4.473-12.16.033-.38.037-.72.063-1H1z"
            fill="#fff"
        />
    </TailWrapper>
)

const getParent = (role: 'inline' | 'showcase' | 'supporting') => {
    switch (role) {
        case 'inline':
            return InlineQuote
        case 'supporting':
            return SupportingQuote
        case 'showcase':
            return ShowcaseQuote
    }
}

export const Pullquote = ({ cite, role, attribution }: PullquoteEl) => {
    const Parent = getParent(role)
    return (
        <Parent>
            <Quote height="12px" />
            {cite}
            {attribution && <Attrib>{attribution}</Attrib>}
            <Tail />
        </Parent>
    )
}
