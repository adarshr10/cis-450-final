import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import DashboardMovieRow from './DashboardMovieRow';

import '../style/PageLayout.css'
import Sidebar from './Sidebar';


// TODO: EDIT AND MODIFY AS NEEDED. (will need to do lots of modifications)


export default class ArtistPage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      movies: []
    };

    this.showMovies = this.showMovies.bind(this);
  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/keywords",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <KeywordButton 
          id={"button-" + keywordObj.kwd_name} 
          onClick={() => this.showMovies(keywordObj.kwd_name)} 
          keyword={keywordObj.kwd_name} 
        /> 
      );

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        keywords: keywordsDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };

  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  showMovies(keyword) {
    fetch(`http://localhost:8081/keywords/${keyword}`, {method: 'GET'})
    .then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      console.error(err); // Print the error if there is one.
    }).then(movieList => {
      if (!movieList) return;

      const movieRows = movieList.map(({title, rating, num_ratings}) => 
        <DashboardMovieRow
          title={title}
          rating={rating}
          num_ratings={num_ratings}
        />
      );

      this.setState({movies: movieRows});
    }, err => {
      console.error(err); // Print the error if there is one.
    });
  };

  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/artist" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          Here's the timeline.
        </div>
        <div className="statsContainer">
          Here are the stats.
        </div>
      </div>
    );
  };
};
