import React from 'react';

export default class SongSimilarDiv extends React.Component {
	render() {
		return (
			<tr className="id" id={this.props.id}>
                    <td className="title">
						<a href={'/song/' + encodeURIComponent(this.props.id)}>{this.props.title}</a>
					</td>
                <td className="performer">
					<a href={'/artist/' + encodeURIComponent(this.props.performer)}>{this.props.performer}</a>
				</td>
			</tr>
		);
	};
};
