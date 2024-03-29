import React from 'react';
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

export default class SongBillboardDiv extends React.Component {
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<Plot divId={this.props.id || null}
                data={
                this.props.data
                } 
				layout={this.props.layout}
				displayModeBar={false}
        onClick={this.props.onClick || null}
            />
		);
	};
};
