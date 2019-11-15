import React from 'react'
import { Article as TArticle, Element as TElement } from '../model/Article'
import { Pillar } from '../model/Pillar'
import { Header } from './Header'
import { HTML } from './HTML'
import { InlineImage } from './InlineImage'
import { LineContainer } from './LineContainer'
import { Pullquote } from './Pullquote'

const Element = ({ element }: { element: TElement }) => {
    switch (element.type) {
        case 'html': {
            return <HTML dangerouslySetInnerHTML={{ __html: element.html }} />
        }
        case 'image': {
            return <InlineImage {...element} />
        }
        case 'pullquote': {
            return <Pullquote {...element} />
        }
        default: {
            return null
        }
    }
}

export const Article = ({
    article,
    pillar,
}: {
    article: TArticle
    pillar: Pillar
}) => (
    <div>
        <Header {...{ article, pillar }} />
        <LineContainer>
            {article.elements.map((el, i) => (
                <Element key={i} element={el} />
            ))}
        </LineContainer>
    </div>
)
