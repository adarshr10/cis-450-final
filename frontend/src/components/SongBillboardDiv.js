import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Plot from 'react-plotly.js';

export default class SongSimilarDiv extends React.Component {
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<Plot id={this.props.id}
                data={[
                this.props.data
                ]}
            />
		);
	};
};
