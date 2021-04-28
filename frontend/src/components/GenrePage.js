import React from 'react';

import '../style/PageLayout.css'
import Sidebar from './Sidebar';

// TODO: EDIT AND MODIFY AS NEEDED. (will need to do lots of modifications)


export default class GenrePage extends React.Component {
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
        <Sidebar curPage="/genre" className="sidebarContainer"></Sidebar>

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
