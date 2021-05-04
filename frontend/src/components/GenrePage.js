import React from 'react';
import "../style/GenrePage.css"
import { Row, Table } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar";
import SongInformationDiv from './SongInformationDiv';
import SongLyricDiv from './SongLyricDiv';
import GenreSongsDiv from './GenreSongsDiv';
import SongBillboardDiv from './SongBillboardDiv';

export default class SongPage extends React.Component {
  
  constructor(props) {
    super(props);
    var d = new Date();

    this.state = {
      lyrics: [],
      songs: [],
      info: "",
      billboard: "",
      lowerApp: 1950,
      upperApp: parseInt(d.getFullYear()),
      lowerLyric: 1950,
      upperLyric: parseInt(d.getFullYear()),
      yearsApp: [],
      yearsLyric: [],
      genre: props.genre || ""
    };

    for (var i = 1950; i < parseInt(d.getFullYear()) + 1; i++) {
      this.state.yearsApp.push(<option className="genresOption" value={i}>{i}</option>);
      this.state.yearsLyric.push(<option className="genresOption" value={i}>{i}</option>);
    }

    this.showLyrics = this.showLyrics.bind(this);
    this.showSongs = this.showSongs.bind(this);
    this.showInformation = this.showInformation.bind(this);
    this.showBillboard = this.showBillboard.bind(this);
    this.handleLowerAppChange = this.handleLowerAppChange.bind(this);
    this.handleUpperAppChange = this.handleUpperAppChange.bind(this);
    this.handleLowerLyricChange = this.handleLowerLyricChange.bind(this);
    this.handleUpperLyricChange = this.handleUpperLyricChange.bind(this);
  };

  componentDidMount() {
    // var songId = "";
    // const url = decodeURIComponent(window.location.pathname)
    // var id = url.substring(url.lastIndexOf("/")+1)
    let genre = this.state.genre;
    let upperApp = this.state.upperApp;
    let lowerApp = this.state.lowerApp;
    let upperLyric = this.state.upperLyric;
    let lowerLyric = this.state.lowerLyric;
    if (!genre) {
      genre = 'rap';
    } 
    this.setState({genre: genre})
    this.showInformation(genre);
    this.showLyrics(genre, lowerLyric, upperLyric);
    this.showSongs(genre, lowerApp, upperApp);
    this.showBillboard(genre);
  };

  handleLowerAppChange(e) {
		this.setState({
			lowerApp: e.target.value
		});
	};

  handleUpperAppChange(e) {
		this.setState({
			upperApp: e.target.value
		});
	};

  handleLowerLyricChange(e) {
		this.setState({
			lowerLyric: e.target.value
		});
	};

  handleUpperLyricChange(e) {
		this.setState({
			upperLyric: e.target.value
		});
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
            <SongInformationDiv 
              id={`${genreOverview.category}`} 
              length={genreOverview.length}
              popularity={parseFloat(genreOverview.popularity).toFixed(4)}
              energy={parseFloat(genreOverview.energy).toFixed(4)}
              acousticness={parseFloat(genreOverview.acousticness).toFixed(4)}
              danceability={parseFloat(genreOverview.danceability).toFixed(4)}
              instrumental={parseFloat(genreOverview.instrumental).toFixed(4)}
              liveness={parseFloat(genreOverview.liveness).toFixed(4)}
              loudness={parseFloat(genreOverview.loudness).toFixed(4)}
              speechiness={parseFloat(genreOverview.speechiness).toFixed(4)}
              tempo={parseFloat(genreOverview.tempo).toFixed(4)}
              valence={parseFloat(genreOverview.valence).toFixed(4)}
            /> 
          ;
        this.setState({
          info: genreInfoDiv
        });
    });
  };


  showLyrics(genre, lower, upper) {
    fetch(`http://localhost:8080/genreLyrics/${genre}/${lower}/${upper}`, {
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

  showSongs(genre, lower, upper) {
    fetch(`http://localhost:8080/genreSongs/${genre}/${lower}/${upper}`, {
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
          id={obj.song_id} 
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
      let months = [];
      let positions = [];
      let urls = [];
      billboardData.forEach((obj, i) => {
        months.push(obj.monthYear);
        positions.push(obj.count);
        urls.push(obj.url)
      });
      let plotData = [{
        x: months,
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
        title: `Number of Appearances on Billboard Top 100 for ${this.state.genre}`,
        plot_bgcolor:"#121212",
        paper_bgcolor:"#212121", 
        font: {
          color: '#1db954'
        }, 
        xaxis: {
          title: {
            text: 'Month',
            font: {
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Appearances in Month',
            font: {
              size: 18,
              color: '#7f7f7f'
            }
          }
        }
      }

      var billboardDiv = <SongBillboardDiv
        data={plotData}
        id={genre}
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

              <div className="dropdown-container">
                Lower Year: 
                <select value={this.state.lowerLyric} onChange={this.handleLowerLyricChange} name="dropdown">
                  <option value=" "> </option>
                  {this.state.yearsLyric}
                </select>
                Upper Year: 
                <select value={this.state.upperLyric} onChange={this.handleUpperLyricChange} name="dropdown">
                  <option value=" "> </option>
                  {this.state.yearsLyric}
                </select>
                <button className="submit-btn" onClick={this.showLyrics.bind(this, this.state.genre, this.state.lowerLyric, this.state.upperLyric)}>Submit</button>
              </div>
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
            <ContentCol title={""+(this.state.genre)}>
              <div className="dropdown-container">
                Lower Year: 
                <select value={this.state.lower} onChange={this.handleLowerAppChange} name="dropdown">
                  <option value=" "> </option>
                  {this.state.yearsApp}
                </select>
                Upper Year: 
                <select value={this.state.upper} onChange={this.handleUpperAppChange} name="dropdown">
                  <option value=" "> </option>
                  {this.state.yearsApp}
                </select>
                <button className="submit-btn" onClick={this.showSongs.bind(this, this.state.genre, this.state.lowerApp, this.state.upperApp)}>Submit</button>
              </div>
              
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Title</th>
                    <th>Appearances</th>
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
