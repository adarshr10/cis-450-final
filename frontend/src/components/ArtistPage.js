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
      artist: props.artist == null ? "Taylor Swift" : this.capitalizeName(props.artist),
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

  capitalizeName(name) {
    return name.replace(/\b(\w)/g, s => s.toUpperCase());
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
      const gen = {};
      rows.forEach((obj) => {
        gen[obj.category] = obj.count;
      });
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
          <td className="topSong">{obj.title}</td>
          <td className="topSong">{obj.peak}</td>
          <td className="topSong">{obj.weeks}</td>
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
          <tr className="id" key={i}>
				    <td className="title"><a href={'/artist/' + obj.artist}>{obj.artist}</a></td>
			    </tr>
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
      const weeks = [], peak= [], count = []
      rows.forEach((obj) => {
        weeks.push(obj.week);
        peak.push(obj.peak);
        count.push(obj.count);
      })
      let plotData = [{
        x: weeks,
        y: peak,
        type: "bar",
        name: "Position of Highest Song on Billboard (peak)",
        line: {color: "white"}
      }, 
      {
        x: weeks,
        y: count,
        type: "bar",
        yaxis: "y2", 
        name: "Number of Songs on Billboard",
        line: {color: '#7F7F7F'}
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
        margin: {b: 100, t: 75},
        showlegend: true,
	      legend: {"orientation": "h", xanchor: "center", y: -.2, x: 0.5},
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
      id={artist}
      layout={configuration}
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
          <div className="rowContainer">
          <Row style={{margin: 0}}>
            <ContentCol title="Information" subtitle={this.state.artist} padding={true}>
              <div>Genres: {Object.keys(this.state.genres).join(", ")}</div>
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
          </Row>
          <Row style={{margin: 0}}>
            
            <ContentCol title="Similar Artists">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Artist Name</th>
                  </tr>
                  {this.state.similarArtists}
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
      </div>
    );
  };
};
