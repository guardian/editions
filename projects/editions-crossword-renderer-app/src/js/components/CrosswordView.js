import React, { Component } from "react";
import ReactDOM from "react-dom";
import Crossword from "react-crossword";

class CrosswordView extends Component {
 
  render() {

	const crosswordData = window.crosswordData

	if (window.crosswordData) {
		return (
			<div id="crossword-view">
				<Crossword data={crosswordData}
				/>
			</div>
		)
	}

	return null
  }

}

const wrapper = document.getElementById("crossword-container");
wrapper ? ReactDOM.render(<CrosswordView />, wrapper) : false;

export default CrosswordView;