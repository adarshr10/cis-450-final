import React from 'react';

import { Row, Table } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import '../style/PageLayout.css'
import '../style/ArtistPage.css'
import Sidebar from './Sidebar';
import SongLyricDiv from './SongLyricDiv'
import SongBillboardDiv from './SongBillboardDiv'


// TODO: EDIT AND MODIFY AS NEEDED. (will need to do lots of modifications)


export default class ArtistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: props.artist == null ? "Taylor Swift" : this.toTitleCase(props.artist),
      genres: [],
      topLyrics: [],
      topSongs: [],
      billboard: [],
      similarArtists: []
    };
    this.getGenres = this.getGenres.bind(this);
    this.getTopLyrics = this.getTopLyrics.bind(this);
    this.getTopSongs = this.getTopSongs.bind(this);
    this.getSimilarArtists = this.getSimilarArtists.bind(this);
    this.getBillboard = this.getBillboard.bind(this);
  };

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // React function that is called when the page load.
  componentDidMount() {
    this.getGenres(this.state.artist);
    this.getTopLyrics(this.state.artist);
    this.getTopSongs(this.state.artist);
    this.getSimilarArtists(this.state.artist)
    this.getBillboard(this.state.artist)
  };

  getGenres(artist){
    fetch(`http://localhost:8080/artist/artistGenres/${artist}`, {
      method: "GET"
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(rows => {
      if(!rows) return;
      const gen = rows.map((obj, i) => 
        <span><a href={'/genre/' + obj.category}>{obj.category}</a>, </span>
      );
      this.setState({genres: gen})
    })
  }

  getTopLyrics(artist){
    fetch(`http://localhost:8080/artist/topLyrics/${artist}`, {
      method: "GET"
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(rows => {
      if(!rows) return;
      if(rows.length === 0){
        this.setState({topLyrics: <tr><td colSpan="3">Unavailable Information on this Artist</td></tr>})
      }else{
        const divs = rows.map((obj, i) => 
          <SongLyricDiv 
            key={i}
            id={`${obj.word}-${obj.count}`} 
            word={obj.word}
            frequency={obj.count}
            popularity={obj.popularity}
          /> 
        );
        this.setState({topLyrics: divs})
      }
    })
  }

  getTopSongs(artist){
    fetch(`http://localhost:8080/artist/topSongs/${artist}`, {
      method: "GET"
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(rows => {
      if(!rows) return;
      const divs = rows.map((obj, i) => 
        <tr key={i}>
          <td className="topSong title"><a href={"/song/"+obj.title.toLowerCase()+this.state.artist.toLowerCase()}>{obj.title}</a></td>
          <td className="topSong">{obj.peak === 999999 ? "N/A":obj.peak}</td>
          <td className="topSong">{obj.weeks === -1 ? "N/A":obj.weeks}</td>
        </tr>
      )
      this.setState({topSongs: divs})
    })
  }

  getSimilarArtists(artist){
    fetch(`http://localhost:8080/artist/similarArtists/${artist}`, {
      method: "GET"
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(rows => {
      if(!rows) return;
      const divs = rows.map((obj, i) => {
        return (
				  <li key={i} className="title mb-2"><a href={'/artist/' + obj.artist}>{obj.artist}</a></li>
        )
      })
      this.setState({similarArtists: divs})
    })
  }

  getBillboard(artist){
    fetch(`http://localhost:8080/artist/billboardPerformance/${artist}`, {
      method: "GET"
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(rows => {
      if(!rows) return;
      const weeks = [], peak= [], count = [], billboard=[];
      rows.forEach((obj) => {
        weeks.push(obj.week);
        billboard.push(obj.url);
        peak.push(obj.peak);
        count.push(obj.count);
      })
      let plotData = [{
        x: weeks,
        y: peak,
        type: "scatter",
        mode: 'markers',
        name: "Position of Highest Song<br>on Billboard (peak)",
        line: {color: "#7F7F7F"}
      }, 
      {
        x: weeks,
        y: count,
        customdata: billboard,
        type: "bar",
        yaxis: "y2", 
        name: "Number of Songs on<br>Billboard",
        marker: {color: '#238bdb'}
      }]
      let configuration = {
        width: document.getElementsByClassName("timelineContainer")[0].clientWidth,
        height: document.getElementsByClassName("timelineContainer")[0].clientHeight,
        title: `Top/Number of Songs on the Billboard Top 100 for ${this.state.artist}`,
        plot_bgcolor:"#121212",
        paper_bgcolor:"#212121", 
        font: {
          color: '#1db954'
        },
        barmode: "group",
        margin: {b: 100, t: 75, r:20},
        xaxis: {
          title: {
            text: 'Week',
            font: {
              size: 18,
              color: 'white'
            }
          },
        },
        yaxis: {
          autorange: 'reversed',
          title: {
            text: 'Peak Ranking',
            font: {
              size: 18,
              color: 'white'
            }
          }
        },
        yaxis2: {
          title:{
            text: 'Count',
            font: {
              size: 18,
              color: 'white'
            }
          },
          overlaying: 'y',
          side: 'right'
        }
      }
      var billboardDiv = <SongBillboardDiv
      data={plotData}
      id={artist.replace(" ", "-") + "-plotly"}
      layout={configuration}
      onClick={function(data){
        if(data.points.length > 1){
            window.open(data.points[1].customdata, "_blank", "");
          }
        }
      }
    />
      this.setState({billboard: billboardDiv})
    })
  }

  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/artist" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          {this.state.billboard}
        </div>
        <div className="statsContainer">
          <Row style={{margin: 0}}>
            <ContentCol title="Information">
              <h4 className="mt-3 mx-3">{this.state.artist}</h4>
              <hr className="mx-3"style={{backgroundColor: "white"}}></hr>
              <div className='info-col m-3'>
                <div id="genre-list mb-2">Genres: {this.state.genres}</div>             
                <div>
                  <span>Similar Artists:</span>
                  <ul id="similarArtDiv">
                    {this.state.similarArtists}
                  </ul>
                </div>
              </div>
          </ContentCol>
            <ContentCol title="Top Songs">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Song</th>
                    <th>Peak Position</th>
                    <th>Weeks on Chart</th>
                  </tr>
                  {this.state.topSongs}
                </tbody>
              </Table>
            </ContentCol>
            <ContentCol title="Top Lyrics">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Word</th>
                    <th>Frequency</th>
                    <th>Popularity</th>
                  </tr>
                  {this.state.topLyrics}
                </tbody>
              </Table>
            </ContentCol>
          </Row>
        </div>
      </div>
    );
  };
};
