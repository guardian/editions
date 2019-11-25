import React from 'react'
import CrosswordView from './js/components/CrosswordView.jsx'
import ReactDOM from 'react-dom'

const wrapper = document.getElementById('crossword-container')

window.loadCrosswordData = (id, crosswordData) => {
    wrapper
        ? ReactDOM.render(
              <CrosswordView id={id} crosswordData={crosswordData} />,
              wrapper,
          )
        : false
}
