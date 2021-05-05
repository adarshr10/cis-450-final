import React from 'react';

// props: genreName
export default class LyricGenresDiv extends React.Component {
	render() {
		return (
			<tr className="id">
                <td className="genre">
                    <a href={'/genre/' + encodeURIComponent(this.props.genreName)}>{this.props.genreName}</a>
                </td>
			</tr>
		);
	};
};
