import React from 'react';

export default class SongLyricDiv extends React.Component {

	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<tr className="id" id={this.props.id}>
				<td className="word"><a href={'/lyric/' + encodeURIComponent(this.props.word)}>{this.props.word}</a></td>
                <td className="frequency">{this.props.frequency}</td>
                <td className="popularity">{this.props.popularity}</td>
			</tr>
		);
	};
};
