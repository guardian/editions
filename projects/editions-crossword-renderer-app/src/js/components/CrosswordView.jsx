import React, { Component } from 'react'
import Crossword from 'react-crossword'
import crossy from './crossy'
class CrosswordView extends Component {
    render() {
        let { crosswordData } = window
        if (!crosswordData) crosswordData = crossy
        if (crosswordData) {
            return (
                <div id="crossword-view">
                    <Crossword data={crosswordData} />
                </div>
            )
        }

        return null
    }
}

export default CrosswordView
