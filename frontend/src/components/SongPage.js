import React from 'react';
import "../style/SongPage.css"
import { Row, Table, Button } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar";
import SongInformationDiv from './SongInformationDiv';
import SongLyricDiv from './SongLyricDiv';
import SongSimilarDiv from './SongSimilarDiv';
import SongBillboardDiv from './SongBillboardDiv';
import {Howl} from 'howler'

export default class SongPage extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      lyrics: [],
      songs: [],
      info: "",
      billboard: "",
      songId: props.songId || "",
      songName: "",
      sampleLink: "", 
      sound: ""
    };

    this.showLyrics = this.showLyrics.bind(this);
    this.showSongs = this.showSongs.bind(this);
    this.showInformation = this.showInformation.bind(this);
    this.showBillboard = this.showBillboard.bind(this);
  };

  componentDidMount() {
    // var songId = "";
    // const url = decodeURIComponent(window.location.pathname)
    // var id = url.substring(url.lastIndexOf("/")+1)
    let songId = this.state.songId;
    if (!songId) {
      songId = '...baby one more timebritney spears';
    } 
    this.setState({songId: songId})
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
      let title = songOverview.title;
      let link = songOverview.url;

      let length = parseInt(songOverview.length);
      var minutes = Math.floor(length / 60000);
      var seconds = ((length % 60000) / 1000).toFixed(0);
      length = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

      songOverview.length = length;

      this.setState({
        songName: title, 
        sampleLink: link, 
        sound: link ? new Howl({
            src: [link],
            html5: true
          }) : null
      });


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
              instrumental={songOverview.instrumental}
              key={songOverview.key}
              liveness={songOverview.liveness}
              loudness={songOverview.loudness}
              speechiness={songOverview.speechiness}
              tempo={songOverview.tempo}
              time_signature={songOverview.time_signature}
              valence={songOverview.valence}
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
      let lyricsInfo = "";
      if (songLyrics.length === 0) {
        lyricsInfo = <tr>
          <td>No</td>
          <td>Data</td>
          <td>Available</td>
        </tr>
      } else {
        lyricsInfo = songLyrics.map((obj, i) =>
        <SongLyricDiv 
          key={i}
          id={`${obj.word}-${obj.count}`} 
          word={obj.word}
          frequency={obj.count}
          popularity={obj.popularity}
        /> 
      );
      }
          
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
          id={obj.song_id} 
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
      let urls = [];
      billboardData.forEach((obj, i) => {
        weeks.push(obj.week);
        positions.push(obj.position);
        urls.push(obj.url);
      });
      let plotData = [{
        x: weeks,
        y: positions,
        customdata: urls,
        type: "scatter",
        mode: "lines", 
        line: {
          color: '#7F7F7F'
        }
      }]
      
      let configuration = {
        width: document.getElementsByClassName("timelineContainer")[0].clientWidth,
        height: document.getElementsByClassName("timelineContainer")[0].clientHeight,
        title: `Billboard Top 100 Rankings for ${this.state.songName}`,
        plot_bgcolor:"#121212",
        paper_bgcolor:"#212121", 
        font: {
          color: '#1db954'
        }, 
        xaxis: {
          title: {
            text: 'Time Period on the Billboard Top 100',
            font: {
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Ranking',
            font: {
              size: 18,
              color: '#7f7f7f'
            }
          },
          autorange: 'reversed'
        }
      }

      var billboardDiv = <SongBillboardDiv
        data={plotData}
        id={id}
        layout={configuration}
        onClick={function(data){
          if(data.points.length == 1){
              window.open(data.points[0].customdata, "_blank", "");
            }
          }
        }
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
          <div className="mb-4 musicControlContainer">
            <div className="musicPlayContainer">
              <Button disabled={!this.state.sound} variant="outline-success" onClick={() => {
                  console.log(this.state.sound)
                  if (!this.state.sound.playing()) {
                    this.state.sound.play();
                  }
                }
              }>Play</Button>
              <Button disabled={!this.state.sound} variant="outline-success" onClick={() => {
                  if (this.state.sound.playing()) {
                    this.state.sound.pause();
                  }
                }
              }>Pause</Button>
              <Button disabled={!this.state.sound} variant="outline-success" onClick={() => {
                  this.state.sound.stop();
                }
              }>Reset</Button>
            </div>
            <p>If buttons are disabled, no audio is available for this track!</p>
          </div>
          <Row style={{margin: 0}}>
            <ContentCol title="Information" padding={true}>
              {this.state.info}
            </ContentCol>
            <ContentCol title="Top Lyrics">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Word</th>
                    <th>Frequency</th>
                    <th>Popularity</th>
                  </tr>
                  {this.state.lyrics}
                </tbody>
              </Table>
            </ContentCol>
            <ContentCol title="Similar Songs">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Title</th>
                    <th>Artist</th>
                  </tr>
                  {this.state.songs}
                </tbody>
              </Table>
            </ContentCol>
          </Row>
        </div>
      </div>
    );
  };
};
