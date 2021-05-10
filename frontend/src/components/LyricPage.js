import React from 'react';
import { Row, Table } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar"
import {stemmer} from 'stemmer'
import SongSimilarDiv from './SongSimilarDiv'
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
import '../style/PageLayout.css'

// ------- page for a single lyric

export default class LyricPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lyric: this.props.lyric,
      topGenres: [],
      topArtists: [],
      topSongs: [],
      billboard: ""
    };

    this.showTopGenres = this.showTopGenres.bind(this);
    this.showTopArtists = this.showTopArtists.bind(this);
    this.showTopSongs = this.showTopSongs.bind(this);
    this.showBillboard = this.showBillboard.bind(this);
  };

  componentDidMount() {
    let lyric = this.props.lyric;
    if (!lyric) {
      lyric = 'love';
    } 
    // lyric = stemmer(lyric);
    this.setState({lyric: lyric})
    // this.showInformation(lyric);
    this.showTopArtists(lyric);
    this.showTopSongs(lyric);
    this.showTopGenres(lyric);
    this.showBillboard(lyric);
  };

  // componentDidUpdate(prevProps){
  //   if(prevProps.lyric !== this.props.lyric){
  //     let lyric = this.props.lyric;
  //     if (!lyric) {
  //       lyric = 'love';
  //     } 
  //     // lyric = stemmer(lyric);
  //     this.setState({lyric: lyric})
  //     // this.showInformation(lyric);
  //     this.showTopArtists(lyric);
  //     this.showTopSongs(lyric);
  //     this.showTopGenres(lyric);
  //     this.showBillboard(lyric);
  //   }
  // }

  // displays top artists for this lyric
  showTopArtists(lyric) {
    fetch(`http://localhost:8080/lyric/topArtists/${lyric}`, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.error(err);
    }).then(artists => {
      let artistDivs = "";
      if (artists.length === 0) {
        artistDivs = <tr>
          <td>No Data Available</td>
        </tr>
      } else {
        artistDivs = artists.map((obj, i) =>
        <LyricArtistsDiv 
          key={i}
          artistName={obj.performer}
        />
      );
      }
          
      this.setState({
        topArtists: artistDivs
      });
    });
  }

  // displays top genres for this lyric
  showTopGenres(lyric) {
    fetch(`http://localhost:8080/lyric/topGenres/${lyric}`, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.error(err);
    }).then(genres => {
      let genresInfo = "";
      if (genres.length === 0) {
        genresInfo = <tr>
          <td>No Data Available</td>
        </tr>
      } else {
        genresInfo = genres.map((obj, i) =>
        <LyricGenresDiv 
          key={i}
          genreName={obj.category}
        /> 
      );
      }
          
      this.setState({
        topGenres: genresInfo
      });
    });
  };

  // displays top songs for this lyric
  showTopSongs(lyric) {
    fetch(`http://localhost:8080/lyric/topSongs/${lyric}`, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(songs => {
      if (!songs) return;
      let songDivs = songs.map((obj, i) =>
        <SongSimilarDiv 
          key={i}
          id={obj.song_id} 
          title={obj.title}
          performer={obj.performer}
        /> 
      );

      this.setState({
        topSongs: songDivs
      });
    });
  };



  // week, url, word_count, song_count
  // displays billboard performance for this lyric
  showBillboard(lyric) {
    fetch(`http://localhost:8080/lyric/billboardPlot/${lyric}`, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.error(err);
    }).then(billboardData => {
      if (!billboardData) return;
      let weeks = [], counts = [], urls=[];
      billboardData.forEach((obj, i) => {
        weeks.push(obj.week);
        counts.push(obj.song_count);
        urls.push(obj.url)
      });
      let plotData = [{
        x: weeks,
        y: counts,
        customdata: urls,
        type: "bar",
        line: {
          color: '#7F7F7F'
        }
      }]
      
      let configuration = {
        width: document.getElementsByClassName("timelineContainer")[0].clientWidth,
        height: document.getElementsByClassName("timelineContainer")[0].clientHeight,
        title: `Number of Billboard Top 100 Songs with \'${this.state.lyric}\'`,
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
              color: 'white'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Number of Songs',
            font: {
              size: 18,
              color: 'white'
            }
          }
        }
      }

      let billboardDiv = <LyricBillboardDiv
        data={plotData}
        id={lyric}
        layout={configuration}
        onClick={function(data){
          if(data.points.length === 1){
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
        <Sidebar curPage="/lyric" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          {this.state.billboard}
        </div>
        <div className="statsContainer">
        <Row style={{height: "100%", margin: 0}}>
            <ContentCol title="Top Genres">
              <Table borderless responsive="sm">
                <tbody>
                  {this.state.topGenres}
                </tbody>
              </Table>
            </ContentCol>
            <ContentCol title="Top Artists">
              <Table borderless responsive="sm">
                <tbody>
                  {this.state.topArtists}
                </tbody>
              </Table>
            </ContentCol>
            <ContentCol title="Top Songs">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Title</th>
                    <th>Artist</th>
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


// div for top artists
// props: artistName
class LyricArtistsDiv extends React.Component {
	render() {
		return (
			<tr className="id">
                <td className="artist">
                    <a href={'/artist/' + encodeURIComponent(this.props.artistName)}>{this.props.artistName}</a>
                </td>
			</tr>
		);
	};
};

// div for billboard 
// props: data, id, layout
const Plot = createPlotlyComponent(Plotly);
class LyricBillboardDiv extends React.Component {
	render() {
		return (
			<Plot divId={this.props.id}
                data={
                this.props.data
                } 
				layout={this.props.layout}
				displayModeBar={false}
        onClick={this.props.onClick || null}
      />
		);
	};
};

// div for genres in lyric page
class LyricGenresDiv extends React.Component {
	render() {
		return (
			<tr className="id">
                <td className="genre">
                    <a href={'/genre/' + encodeURIComponent(this.props.genreName)}>{this.props.genreName}</a>
                </td>
			</tr>
		);
	};
};