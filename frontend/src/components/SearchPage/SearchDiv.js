import React from 'react';

export default class SearchDiv extends React.Component {

	render() {
		return (
			<tr className="id" id={this.props.title}>
				<td className="title">
					<a href={'/song/' + this.props.id}>{this.props.title}</a>
				</td>
				{/* <td className="title">{this.props.title}</td> */}
				<td className="performer">{this.props.performer}</td>
                <td className="ranking">{this.props.ranking}</td>
				<td className="genre">{this.props.genres}</td>
			</tr>
		);
	};
};
