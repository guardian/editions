import React from 'react'
import Crossword from 'react-crossword'

const CrosswordView = ({ crosswordData }) => {
    return (
        <div id="crossword-view">
            <Crossword data={crosswordData} />
        </div>
    )
}

export default CrosswordView
