import React, { Component } from 'react'
import Crossword from 'react-crossword'
class CrosswordView extends Component {
    render() {
        let { crosswordData } = window
        if (crosswordData) {
            return (
                <div id="crossword-view">
                    <Crossword data={crosswordData} />
                </div>
            )
        }

        return <div>Failed to load crossword</div>
    }
}

export default CrosswordView
