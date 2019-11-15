import React from 'react'
import styled from 'styled-components'

const Line = styled.div`
  border-width: 0;
  border-top-width: 1px;
  margin-bottom: 2px;
  border-style: ${props => props.theme.borderStyle}
  width: 100%;
`

export const Multiline = ({
    color,
    count = 4,
}: {
    color: string
    count?: number
}) => (
    <div>
        {Array.from({ length: count }, (_, i) => (
            <Line key={i} style={{ borderColor: color }}></Line>
        ))}
    </div>
)
