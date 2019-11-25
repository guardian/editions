import React from 'react'
import Crossword from '@guardian/react-crossword'

const CrosswordView = ({ id, crosswordData }) => {
    return (
        <div id="crossword-view">
            <Crossword id={id} data={crosswordData} />
        </div>
    )
}

export default CrosswordView
