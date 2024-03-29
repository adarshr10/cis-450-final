import React from 'react';

export default class SongInformationDiv extends React.Component {

	render() {
		let genreComp = <span></span>;
		if (this.props.genres) {
			genreComp = (
			<div className="genres">Genres:
				<ul>
					{this.props.genres.map((genre, i) => 
						<li key={i}><a href={'/genre/' + encodeURIComponent(genre)}>{genre}</a></li>
					)}
				</ul>
			</div>
			);
		}
		return (
			<div className="song" id={this.props.id}>
        {!this.props.isGenre &&
        <div>
        <div className="album">Album: {this.props.album}</div>
        <div className="artist">Artist: <a href = {"/artist/" + encodeURIComponent(this.props.artist)}>{this.props.artist}</a></div>
				<div className="explicit">Explicit: {this.props.explicit}</div>
        </div>}
				<div className="length">Length: {this.props.length} min</div>
				<div className="popularity">Popularity: {this.props.popularity}</div>
				<div className="energy">Energy: {this.props.energy}</div>
                <div className="acousticness">Acousticness: {this.props.acousticness}</div>
				<div className="mode">Mode: {this.props.mode}</div>
				<div className="danceability">Danceability: {this.props.danceability}</div>
				<div className="instrumental">Instrumental: {this.props.instrumental}</div>
				{this.props.key && <div className="key">Key: {this.props.key}</div>}
                <div className="liveness">Liveness: {this.props.liveness}</div>
				<div className="loudness">Loudness: {this.props.loudness}</div>
				<div className="speechiness">Speechiness: {this.props.speechiness}</div>
				<div className="tempo">Tempo: {this.props.tempo}</div>
                <div className="time_signature">Time Signature: {this.props.time_signature}</div>
				<div className="valence">Valence: {this.props.valence}</div>
				<div className="genres">
					{genreComp}
				</div>
			</div>
		);
	};
};
