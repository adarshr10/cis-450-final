import React from 'react';
import "../style/SongPage.css"
import { Row, Table } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar";
import GenreInformationDiv from './GenreInformationDiv';
import GenreLyricDiv from './GenreLyricDiv';
import GenreSongsDiv from './GenreSongsDiv';
import GenreBillboardDiv from './GenreBillboardDiv';

export default class SongPage extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      lyrics: [],
      songs: [],
      info: "",
      billboard: "",
      genre: props.genre || ""
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
    let genre = this.state.genre;
    if (!genre) {
      genre = 'rap';
    } 
    this.showInformation(genre);
    this.setState({genre: genre})
    this.showLyrics(genre);
    this.showSongs(genre);
    this.showBillboard(genre);
  };

  showInformation(genre) {
    fetch(`http://localhost:8080/genreOverview/${genre}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(genreOverview => {
      if (!genreOverview) return;
      genreOverview = genreOverview[0];

      let length = parseFloat(genreOverview.length);
      var minutes = Math.floor(length / 60000);
      var seconds = ((length % 60000) / 1000).toFixed(0);
      length = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;


      genreOverview.length = length;
      const genreInfoDiv = 
            <GenreInformationDiv 
              id={`${genreOverview.category}`} 
              length={genreOverview.length}
              popularity={genreOverview.popularity}
              energy={genreOverview.energy}
              acousticness={genreOverview.acousticness}
              danceability={genreOverview.danceability}
              instrumental={genreOverview.instrumental}
              liveness={genreOverview.liveness}
              loudness={genreOverview.loudness}
              speechiness={genreOverview.speechiness}
              tempo={genreOverview.tempo}
              valence={genreOverview.valence}
            /> 
          ;
        this.setState({
          info: genreInfoDiv
        });
    });
  };


  showLyrics(genre) {
    fetch(`http://localhost:8080/genreLyrics/${genre}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(genreLyrics => {
      if (!genreLyrics) return;
      var lyricsInfo = genreLyrics.map((obj, i) =>
        <GenreLyricDiv 
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

  showSongs(genre) {
    fetch(`http://localhost:8080/genreSongs/${genre}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(topSongs => {
      if (!topSongs) return;
      var bestSongs = topSongs.map((obj, i) =>
        <GenreSongsDiv 
          key={i}
          id={`${obj.song_id}`} 
          title={obj.title}
          num={obj.num}
        /> 
      );
          
      this.setState({
        songs: bestSongs
      });
    });
  };

  showBillboard(genre) {
    fetch(`http://localhost:8080/genreBillboard/${genre}`, {
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
        positions.push(obj.count);
      });
      let plotData = {
        x: weeks,
        y: positions,
        type: "scatter",
        mode: "lines", 
        line: {
          color: '#7F7F7F'
        }
      }
      
      let configuration = {
        width: document.getElementsByClassName("timelineContainer")[0].clientWidth,
        height: document.getElementsByClassName("timelineContainer")[0].clientHeight,
        title: `Number of Appearances on Billboard Top 100 for ${this.state.genre}`,
        plot_bgcolor:"#121212",
        paper_bgcolor:"#212121", 
        font: {
          color: '#1db954'
        }, 
        xaxis: {
          title: {
            text: 'Week',
            font: {
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Appearances in Week',
            font: {
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
      }

      var billboardDiv = <GenreBillboardDiv
        data={plotData}
        id={genre}
        layout={configuration}

      />
      this.setState({
        billboard: billboardDiv
      });
    });
  };

  render() {  
    return (
      <div className="pageContainer">
        <Sidebar curPage="/genre" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          {this.state.billboard}
        </div>
        <div className="statsContainer">
          <Row style={{height: "100%", margin: 0}}>
            <ContentCol title="Information" subtitle="no wya" padding={true}>
              {this.state.info}
            </ContentCol>
            <ContentCol title={"Popular Lyrics in "+(this.state.genre)}>
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
            <ContentCol title={"Hottest Songs in "+(this.state.genre)}>
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Title</th>
                    <th>Appearances in Top 100</th>
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
