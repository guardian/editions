import React from 'react'
import styled from 'styled-components'
import { Byline } from '../Byline'
import { FillToLine } from '../FillToLine'
import { Headline } from '../Headline'
import { LineContainer } from '../LineContainer'
import { Multiline } from '../Multiline'
import { OutieKicker } from '../OutieKicker'
import { Quote } from '../Quote'
import { Standfirst } from '../Standfirst'
import { TrailImage } from '../TrailImage'
import { Article } from '../../model/Article'

const Background = styled.div`
    background: ${props => props.theme.faded};
`

const Popper = styled.div`
    margin-bottom: 8px;
    margin-left: -8px;
    margin-top: -80px;
    padding-right: 70px;
    position: relative;

    @media (min-width: 900px) {
        margin-left: -24px;
    }
`

const InterviewKicker = styled(OutieKicker)`
    background-color: ${props => props.theme.dark};
    color: white;
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 8px;
`

const HeadlineWrapper = styled.div`
    padding: 4px 8px 8px;
`

const InterviewHeadline = styled(Headline)`
    background-color: black;
    box-shadow: 8px 0 0 0 rgba(0, 0, 0, 1), -8px 0 0 0 rgba(0, 0, 0, 1);
    color: white;
    display: inline;
    font-weight: 400;
    line-height: 1.23;
    padding-bottom: 8px;
    vertical-align: top;
`

const InterviewStandfirst = styled(Standfirst)`
    color: ${props => props.theme.dark};
`

const StandardByline = styled(Byline)`
    color: ${props => props.theme.dark};
`

const LightByline = styled(Byline)`
    color: ${props => props.theme.main};
`

const brightColors = {
    TEXT: '#ffe500',
    BG: '#000',
}

const InterviewHeader = ({
    article,
    brightBg = true,
}: {
    article: Article
    brightBg?: boolean
}) => {
    const Byline = brightBg ? LightByline : StandardByline
    return (
        <>
            <Background
                style={brightBg ? { backgroundColor: brightColors.TEXT } : {}}
            >
                <TrailImage {...article.trailImage} />
                <LineContainer>
                    <Popper>
                        <InterviewKicker
                            style={
                                brightBg
                                    ? {
                                          color: brightColors.BG,
                                          backgroundColor: brightColors.TEXT,
                                      }
                                    : {}
                            }
                        >
                            Interview
                        </InterviewKicker>
                        <HeadlineWrapper>
                            <InterviewHeadline>
                                <Quote color="#fff" />
                                {article.headline}
                            </InterviewHeadline>
                        </HeadlineWrapper>
                    </Popper>
                    <InterviewStandfirst
                        style={
                            brightBg
                                ? {
                                      color: brightColors.BG,
                                  }
                                : {}
                        }
                    >
                        {article.standfirst}
                    </InterviewStandfirst>
                </LineContainer>
            </Background>
            <LineContainer>
                <FillToLine>
                    <Multiline color="#999" />
                </FillToLine>
                <Byline>{article.byline}</Byline>
                <FillToLine>
                    <Multiline color="#dcdcdc" count={1} />
                </FillToLine>
            </LineContainer>
        </>
    )
}

export { InterviewHeader }
