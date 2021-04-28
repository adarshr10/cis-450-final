import React from 'react';

export default class SongInformationDiv extends React.Component {

	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<div className="song" id={this.props.id}>
				<div className="album">Album: {this.props.album}</div>
				<div className="explicit">Explicit: {this.props.explicit}</div>
				<div className="length">Length: {this.props.length}</div>
				<div className="popularity">Popularity: {this.props.popularity}</div>
				<div className="energy">Energy: {this.props.energy}</div>
                <div className="acousticness">Acousticness: {this.props.acousticness}</div>
				<div className="mode">Mode: {this.props.mode}</div>
				<div className="danceability">Danceability: {this.props.danceability}</div>
                <div className="genres">Genres: {this.props.genres}</div>
			</div>
		);
	};
};
