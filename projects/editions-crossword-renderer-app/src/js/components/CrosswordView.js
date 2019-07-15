import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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

        return 'sdsd'
    }
}

const wrapper = document.getElementById('crossword-container')
wrapper ? ReactDOM.render(<CrosswordView />, wrapper) : false

export default CrosswordView
