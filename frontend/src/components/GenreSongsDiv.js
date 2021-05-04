import React from 'react';

export default class GenreSongsDiv extends React.Component {
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<tr className="id" id={this.props.id}>
                    <td className="title">
						<a href={'/song/' + encodeURIComponent(this.props.id)}>{this.props.title}</a>
					</td>
                <td className="num">{this.props.num}</td>
			</tr>
		);
	};
};
