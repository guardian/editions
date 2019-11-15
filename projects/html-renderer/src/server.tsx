import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider } from 'styled-components'
import { App } from './App'
import { Dev } from './Dev'
import { getTheme } from './helpers'
import { exampleArticle } from './model/Article'

const app = express()

const passthrough = (arr: TemplateStringsArray, ...strs: string[]) => {
    let str = ''
    for (let i = 0; i < arr.length; i++) {
        str += `${arr[i] || ''}${strs[i] || ''}`
    }
    return str
}

const html = passthrough
const js = passthrough

app.get('/', (req, res) => {
    const { pillar, type } = req.query
    const sheet = new ServerStyleSheet()
    try {
        const body = ReactDOMServer.renderToStaticMarkup(
            sheet.collectStyles(
                <>
                    <ThemeProvider theme={getTheme(pillar || 'news')}>
                        <Dev params={req.query} />
                        <App
                            article={{
                                ...exampleArticle,
                                type: type || exampleArticle.type,
                            }}
                            pillar={pillar || 'news'}
                        />
                    </ThemeProvider>
                </>,
            ),
        )
        const styleTags = sheet.getStyleTags()
        res.send(html`
            <html>
                <head>
                    ${styleTags}
                </head>
                <body>
                    ${body}
                </body>
                <script>
                    ${js`
          /**
           * We need to add some custom JS here as, for now, we wont' be
           * hydrating the React on the client
           *
           * So for any interactivity it will need to be added with vanilla JS
           */
          window.addEventListener("load", () => {
            [...document.querySelectorAll("[data-toggle]")].forEach(toggler => {
              toggler.addEventListener("click", () => {
                const selector = toggler.dataset.toggle;
                const els = document.querySelectorAll(selector);
                [...els].forEach(el => {
                  el.dataset.open = !(
                    el.dataset.open && JSON.parse(el.dataset.open)
                  );
                });
              });
            });
          });
          `}
                </script>
            </html>
        `)
    } catch (error) {
        // handle error
        console.error(error)
    } finally {
        sheet.seal()
    }
})

export { app }
