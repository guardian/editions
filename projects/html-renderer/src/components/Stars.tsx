import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background-color: #ffe500;
    display: inline-block;
    font-size: 22px;
    line-height: 1;
    color: #000;
    padding: 2px 4px;
`

export const Stars = ({ count }: { count: number }) => (
    <Container>
        {'★'.repeat(count)}
        {'☆'.repeat(5 - count)}
    </Container>
)
