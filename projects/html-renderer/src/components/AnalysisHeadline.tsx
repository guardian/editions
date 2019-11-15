import React from 'react'
import styled from 'styled-components'

const Header = styled.h1`
    color: #000;
    margin: 16px 0 0;
    line-height: 32px;
    font-size: 30px;
    font-weight: 300;
    text-decoration-color: ${props => props.theme.main};
    text-decoration-thickness: 1px;
`

export const AnalysisHeadline = ({
    children,
    underline,
}: {
    children: React.ReactNode
    underline: boolean
}) => (
    <Header
        style={{
            textDecorationLine: underline ? 'underline' : 'none',
        }}
    >
        {children}
    </Header>
)
