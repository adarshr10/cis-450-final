import React from 'react';

export default class SearchDiv extends React.Component {

	render() {
    const genres = this.props.genres.split(" | ")
		return (
			<tr className="id" id={this.props.title}>
				<td className="title">
					<a href={'/song/' + encodeURIComponent(this.props.id)}>{this.props.title}</a>
				</td>
				{/* <td className="title">{this.props.title}</td> */}
				<td className="performer"><a href={'/artist/'+encodeURIComponent(this.props.performer)}>{this.props.performer}</a></td>
                <td className="ranking">{this.props.ranking}</td>
				<td className="genre">{genres.map((gen, i) => 
            <span key={i}><a href={`/genre/${gen}`}>{gen}</a>{(i === genres.length-1) ? "": " | "}</span>)}</td>
			</tr>
		);
	};
};
