import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Article } from './components/Article'
import { Article as TArticle } from './model/Article'
import { Pillar } from './model/Pillar'

const GlobalStyle = createGlobalStyle`
  *, :before, :after {
    box-sizing: border-box;
  }

  html,
  body {
    font-family: "GH Guardian Headline";
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }
`

const App = ({ pillar, article }: { pillar: Pillar; article: TArticle }) => (
    <>
        <GlobalStyle />
        <Article article={article} pillar={pillar} />
    </>
)

export { App }
