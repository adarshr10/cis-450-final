import React from 'react';
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

export default class SongSimilarDiv extends React.Component {
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<Plot id={this.props.id}
                data={[
                this.props.data
                ]} 
				layout={this.props.layout}
				displayModeBar={false}
            />
		);
	};
};
