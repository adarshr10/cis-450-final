import React from 'react';

export default class Div_0 extends React.Component {

	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<tr className="id" id={this.props.word}>
				<td className="num">{this.props.num}</td>
				<td className="word">
					<a href={'/lyric/' + this.props.word}>{this.props.word}</a>
				</td>
				<td className="count">{this.props.count}</td>
			</tr>
		);
	};
};

