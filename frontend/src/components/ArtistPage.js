import React from 'react';

import { Row, Table, Col } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import '../style/PageLayout.css'
import '../style/ArtistPage.css'
import Sidebar from './Sidebar';
import SongLyricDiv from './SongLyricDiv'
import SongBillboardDiv from './SongBillboardDiv'


export default class ArtistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: props.artist == null ? "Taylor Swift" : props.artist,
      genres: [],
      topLyrics: [],
      topSongs: [],
      top100Weeks: 0,
      billboard: [],
      similarArtists: []
    };
    this.getGenres = this.getGenres.bind(this);
    this.getTopLyrics = this.getTopLyrics.bind(this);
    this.getTopSongs = this.getTopSongs.bind(this);
    this.getSimilarArtists = this.getSimilarArtists.bind(this);
    this.getBillboard = this.getBillboard.bind(this);
    this.getTop100Weeks = this.getTop100Weeks.bind(this);
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
    this.getTop100Weeks(this.state.artist);
    this.getTopSongs(this.state.artist);
    this.getSimilarArtists(this.state.artist)
    this.getBillboard(this.state.artist)
  };

  // componentDidUpdate(prevProps){
  //   if(prevProps.artist !== this.props.artist){
  //     const artist = this.props.artist || "Taylor Swift";
  //     this.setState({artist:artist});
  //     this.getGenres(artist);
  //     this.getTopLyrics(artist);
  //     this.getTop100Weeks(artist);
  //     this.getTopSongs(artist);
  //     this.getSimilarArtists(artist)
  //     this.getBillboard(artist)
  //   }
  // }

  getGenres(artist){
    fetch(`http://localhost:8080/artist/artistGenres/${encodeURIComponent(artist)}`, {
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
        (i === rows.length - 1 ? 
          <span key={i}><a href={'/genre/' + obj.category}>{obj.category}</a></span>: 
          <span key={i}><a href={'/genre/' + obj.category}>{obj.category}</a> | </span>)
      );
      this.setState({genres: gen})
    })
  }

  getTopLyrics(artist){
    fetch(`http://localhost:8080/artist/topLyrics/${encodeURIComponent(artist)}`, {
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

  getTop100Weeks(artist){
    fetch(`http://localhost:8080/artist/top100Weeks/${encodeURIComponent(artist)}`, {
      method: "GET"
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(rows => {
      if(!rows) return;
      this.setState({top100Weeks: rows[0].count})
    })
  }

  getTopSongs(artist){
    fetch(`http://localhost:8080/artist/topSongs/${encodeURIComponent(artist)}`, {
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
          <td className="topSong title"><a href={"/song/"+encodeURIComponent(obj.title.toLowerCase()+this.state.artist.toLowerCase())}>{obj.title}</a></td>
          <td className="topSong">{obj.peak === 999999 ? "N/A":obj.peak}</td>
          <td className="topSong">{obj.weeks === -1 ? "N/A":obj.weeks}</td>
        </tr>
      )
      this.setState({topSongs: divs})
    })
  }

  getSimilarArtists(artist){
    fetch(`http://localhost:8080/artist/similarArtists/${encodeURIComponent(artist)}`, {
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
				  <li key={i} className="mb-2"><a href={'/artist/' + encodeURIComponent(obj.artist)}>{obj.artist}</a></li>
        )
      })
      this.setState({similarArtists: divs})
    })
  }

  getBillboard(artist){
    fetch(`http://localhost:8080/artist/billboardPerformance/${encodeURIComponent(artist)}`, {
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
            <Col style={{marginBottom: "1em"}}>
              <h3>Information</h3>
              <div id="artInfoContainer">
                <div className="artInfo mb-4 p-3">
                  <h4>{this.state.artist}</h4>
                  <hr style={{backgroundColor: "white"}}></hr>
                  <div id="genre-list" className="mb-2"><em>Genres:</em> {this.state.genres}</div>
                  <div><em>Total Weeks in Top 100:</em> {this.state.top100Weeks} weeks</div>
                </div>
                    
                <div className='similarArt p-3'>
                  <em>Similar Artists:</em>
                  <ul>
                    {this.state.similarArtists}
                  </ul>
                </div>
              </div>
            </Col>
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
        </div>
      </div>
    );
  };
};
