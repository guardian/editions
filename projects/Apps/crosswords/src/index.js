import React from 'react'
import CrosswordView from './js/components/CrosswordView.jsx'
import { createRoot } from 'react-dom/client'

const wrapper = document.getElementById('crossword-container')
const root = createRoot(wrapper)

window.loadCrosswordData = (id, crosswordData) => {
    wrapper
        ? root.render(<CrosswordView id={id} crosswordData={crosswordData} />)
        : false
}
