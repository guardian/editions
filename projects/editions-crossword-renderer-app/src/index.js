import React from 'react'
import CrosswordView from './js/components/CrosswordView.jsx'
import ReactDOM from 'react-dom'

const wrapper = document.getElementById('crossword-container')

window.loadCrosswordData = crosswordData => {
    wrapper
        ? ReactDOM.render(
              <CrosswordView crosswordData={crosswordData} />,
              wrapper,
          )
        : false
}
