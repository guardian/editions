import styled from 'styled-components'
import { Kicker } from './Kicker'

export const OutieKicker = styled(Kicker)`
    background-color: ${props => props.theme.main};
    padding: 8px 8px 16px;
    position: absolute;
    bottom: 100%;
`
