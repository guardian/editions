import React from 'react'
import styled from 'styled-components'
import { ImageEl } from '../model/Article'

const Wrapper = styled.figure`
    margin: 8px 0;
    float: right;
    width: 100%;

    @media (min-width: 1100px) {
        margin: 0 calc(-50% - 16px) 16px 16px;
    }
`

const Image = styled.img`
    width: 100%;
`

const CaptionText = styled.figcaption`
    font-size: 12px;
    line-height: 1.4;

    @media (min-width: 1100px) {
        margin-left: calc(50% + 8px);
    }
`

export const InlineImage = ({ src, caption, role }: ImageEl) => {
    switch (role) {
        // TODO add more of these
        case 'immersive':
        case 'inline':
        case 'showcase':
        case 'supporting':
        case 'thumbnail':
            return (
                <Wrapper>
                    <Image src={src} />
                    <CaptionText>{caption}</CaptionText>
                </Wrapper>
            )
    }
}
