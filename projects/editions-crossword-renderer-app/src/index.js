import React from 'react'
import CrosswordView from './js/components/CrosswordView.jsx'
import ReactDOM from 'react-dom'

const wrapper = document.getElementById('crossword-container')
wrapper ? ReactDOM.render(<CrosswordView />, wrapper) : false
