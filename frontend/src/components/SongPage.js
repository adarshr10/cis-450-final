import React from 'react';
import "../style/SongPage.css"
import { Row } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar";
import SongInformationDiv from './SongInformationDiv';
import SongLyricDiv from './SongLyricDiv';
import SongSimilarDiv from './SongSimilarDiv';
import SongBillboardDiv from './SongBillboardDiv';

export default class SongPage extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      lyrics: [],
      songs: [],
      info: "",
      billboard: ""
    };

    this.showLyrics = this.showLyrics.bind(this);
    this.showSongs = this.showSongs.bind(this);
    this.showInformation = this.showInformation.bind(this);
    this.showBillboard = this.showBillboard.bind(this);
  };

  componentDidMount() {
    var songId = "";
    var id = window.location.pathname.split('/')
    if (id.length === 2) {
      songId = 'love storytaylor swift';
    } else {
      songId = id[2];
    }
    this.showInformation(songId);
    this.showLyrics(songId);
    this.showSongs(songId);
    this.showBillboard(songId);
  };

  showInformation(id) {
    var songOverview = ""
    var genres = "";
    fetch(`http://localhost:8080/songOverview/${id}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(songStuff => {
      if (!songStuff) return;
      songOverview = songStuff[0]
      if (songOverview.explicit === 1) {
        songOverview.explicit = "Y";
      } else {
        songOverview.explicit = "N";
      }

      fetch(`http://localhost:8080/songGenres/${id}`, {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(genreStuff => {
        if (!genreStuff) return;
        genres = genreStuff.map((obj, i) =>
          obj.category
        );
        genres = genres.join(", ");

        const songInfoDiv = 
            <SongInformationDiv 
              id={`${songOverview.id}`} 
              album={songOverview.album}
              explicit={songOverview.explicit}
              length={songOverview.length}
              popularity={songOverview.popularity}
              energy={songOverview.energy}
              acousticness={songOverview.acousticness}
              mode={songOverview.mode}
              danceability={songOverview.danceability}
              genres={genres}
            /> 
          ;
        this.setState({
          info: songInfoDiv
        });
      });
    });

  };

  showLyrics(id) {
    fetch(`http://localhost:8080/songLyrics/${id}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(songLyrics => {
      if (!songLyrics) return;
      var lyricsInfo = songLyrics.map((obj, i) =>
        <SongLyricDiv 
          key={i}
          id={`${obj.word}-${obj.count}`} 
          word={obj.word}
          frequency={obj.count}
          popularity={obj.popularity}
        /> 
      );
          
      this.setState({
        lyrics: lyricsInfo
      });
    });
  };

  showSongs(id) {
    fetch(`http://localhost:8080/songSimilar/${id}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(songSimilar => {
      if (!songSimilar) return;
      var similar = songSimilar.map((obj, i) =>
        <SongSimilarDiv 
          key={i}
          id={`${obj.song_id}`} 
          title={obj.title}
          performer={obj.performer}
        /> 
      );
          
      this.setState({
        songs: similar
      });
    });
  };

  showBillboard(id) {
    fetch(`http://localhost:8080/songBillboard/${id}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(billboardData => {
      if (!billboardData) return;
      let weeks = [];
      let positions = [];
      billboardData.forEach((obj, i) => {
        weeks.push(obj.week);
        positions.push(obj.position);
      });
      let plotData = {
        x: weeks,
        y: positions,
        type: "scatter",
        mode: "lines"
      }
      var billboardDiv = <SongBillboardDiv
        data={plotData}
        id={id}
      />
      this.setState({
        billboard: billboardDiv
      });
    });
  };

  render() {  
    return (
      <div className="pageContainer">
        <Sidebar curPage="/song" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          {this.state.billboard}
        </div>
        <div className="statsContainer">
          <Row style={{height: "100%", margin: 0}}>
            <ContentCol title="Information" subtitle="no wya">
              {this.state.info}
            </ContentCol>
            <ContentCol title="Top Lyrics" subtitle="Words">
              <table>
                <tbody>
                  <tr>
                    <th>Word</th>
                    <th>Frequency</th>
                    <th>Popularity</th>
                  </tr>
                  {this.state.lyrics}
                </tbody>
              </table>
            </ContentCol>
            <ContentCol title="Similar Songs" subtitle="Titles">
              <table>
                <tbody>
                  <tr>
                    <th>Title</th>
                    <th>Artist</th>
                  </tr>
                  {this.state.songs}
                </tbody>
                
              </table>
            </ContentCol>
          </Row>
        </div>
      </div>
    );
  };
};
