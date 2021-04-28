import React from 'react';
import Sidebar from './Sidebar'; 

// TODO: EDIT AND MODIFY AS NEEDED. (will need to do lots of modifications)
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      movies: []
    };
  };

  // React function that is called when the page load.
  componentDidMount() {
    
  };

  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          Here's the timeline.
        </div>
        <div className="statsContainer">
          Here are the stats.
        </div>
        
        {/*
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br />
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Keywords</div>
            <div className="keywords-container">
              {this.state.keywords}
            </div>
          </div>

          <br />
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header-lg"><strong>Title</strong></div>
                <div className="header"><strong>Rating</strong></div>
                <div className="header"><strong>Vote Count</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.movies}
              </div>
            </div>
          </div>
        </div>
    </div>*/}
      </div>
    );
  };
};
