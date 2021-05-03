import React from 'react';

export default class GenreLyricDiv extends React.Component {

	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<tr className="id" id={this.props.id}>
				<td className="word">{this.props.word}</td>
                <td className="frequency">{this.props.frequency}</td>
                <td className="popularity">{this.props.popularity}</td>
			</tr>
		);
	};
};
