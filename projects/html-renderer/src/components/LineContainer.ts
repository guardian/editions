import styled from 'styled-components'

export const LineContainer = styled.div`
    max-width: 600px;
    // collapse margins with sub pixel padding but no visible impact
    padding: 0.05px 8px;
    position: relative;

    @media (min-width: 614px) {
        border-right: 1px solid #999;
    }

    @media (min-width: 900px) {
        margin-left: 20vw;
    }
`
