import React from 'react'
import { Byline } from '../Byline'
import { Headline } from '../Headline'
import { KickerPositioner } from '../KickerPositioner'
import { LineContainer } from '../LineContainer'
import { Multiline } from '../Multiline'
import { OutieKicker } from '../OutieKicker'
import { Standfirst } from '../Standfirst'
import { TrailImage } from '../TrailImage'
import { Article } from '../../model/Article'
import styled from 'styled-components'

const Outer = styled.div`
    padding-right: 70px;
    position: relative;
`

const ImmersiveHeadline = styled(Headline)`
    color: ${props => props.theme.main};
    font-weight: 600;
`

const ImmersiveLineContainer = styled(LineContainer)`
    margin-top: -80px;
`

const ImmersiveKicker = styled(OutieKicker)`
    background-color: ${props => props.theme.main};
`

const ImmersiveHeader = ({
    article,
    showKicker = false,
    showBottomLine = false,
    backgroundColor,
    color,
}: {
    article: Article
    showKicker?: boolean
    showBottomLine?: boolean
    backgroundColor: string
    color?: string
}) => (
    <div style={{ backgroundColor }}>
        <TrailImage {...article.trailImage} immersive />
        <Outer>
            <ImmersiveLineContainer style={{ backgroundColor }}>
                {showKicker && (
                    <KickerPositioner>
                        <ImmersiveKicker style={{ color }}>
                            {article.kicker}
                        </ImmersiveKicker>
                    </KickerPositioner>
                )}
                <ImmersiveHeadline style={{ color }}>
                    {article.headline}
                </ImmersiveHeadline>
                <Standfirst style={{ color }}>{article.standfirst}</Standfirst>
                <Multiline color={color || '#dcdcdc'} />
                <Byline style={{ color }}>{article.byline}</Byline>
                {showBottomLine && <Multiline color="#dcdcdc" count={1} />}
            </ImmersiveLineContainer>
        </Outer>
    </div>
)

export { ImmersiveHeader }
