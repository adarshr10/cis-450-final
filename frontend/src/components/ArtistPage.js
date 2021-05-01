import React from 'react';

import { Row, Table } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
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
  };

  // React function that is called when the page load.
  componentDidMount() {
 
  };


  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/artist" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          Here's the timeline.
        </div>
        <div className="statsContainer">
        <Row style={{height: "100%", margin: 0}}>
            <ContentCol title="Information" subtitle="no wya" padding={true}>
            </ContentCol>
            <ContentCol title="Top Lyrics">
            </ContentCol>
            <ContentCol title="Similar Songs">
            </ContentCol>
          </Row>
        </div>
      </div>
    );
  };
};
