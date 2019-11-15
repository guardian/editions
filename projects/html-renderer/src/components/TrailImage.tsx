import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    background-color: black;
    background-size: cover;
    background-position: 50% 50%;
    padding-top: 60%;
    position: relative;

    &[data-open='true'] {
        background-image: none !important;

        [data-credit] {
            display: block;
        }
    }
`

const WrapperImmersive = styled(Wrapper)`
    padding-top: 140%;

    @media (min-width: 600px) {
        padding-top: 100%;
    }

    @media (min-width: 900px) {
        padding-top: 100vh;
    }
`

const CreditText = styled.div`
    display: none;
    position: absolute;
    color: white;
    top: 0;
    width: 100%;
    padding: 16px;
`

const Toggle = styled.button`
  appearance: none;
  background-color: ${props => props.theme.main}
  border: none;
  border-radius: 100%;
  color: white;
  display: block;
  width: 40px;
  height: 40px;
  line-height: 20px;
  vertical-align: middle;
  text-align: center;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1;
`

const TrailImage = ({
    src,
    credit,
    immersive = false,
}: {
    src: string
    credit: string
    immersive?: boolean
}) => {
    const Parent = immersive ? WrapperImmersive : Wrapper

    return (
        <Parent id="trail-wrapper" style={{ backgroundImage: `url(${src})` }}>
            <CreditText data-credit="true">{credit}</CreditText>
            <Toggle data-toggle="#trail-wrapper"></Toggle>
        </Parent>
    )
}

export { TrailImage }
