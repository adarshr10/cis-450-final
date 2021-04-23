import React from 'react';
import { Row } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar"

// TODO: EDIT AND MODIFY AS NEEDED. (will need to do lots of modifications)


export default class LyricPage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      movies: []
    };

    // this.showMovies = this.showMovies.bind(this);
  };

  componentDidMount() {
    return null;
  };

  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/lyric" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          Here's the timeline.
        </div>
        <div className="statsContainer">
        <Row style={{height: "100%", margin: 0}}>
            <ContentCol title="Information" subtitle="no wya">hello</ContentCol>
            <ContentCol title="Top Lyrics" subtitle="# of Words">
              <ol>
                <li>one</li>
              </ol>
            </ContentCol>
            <ContentCol title="Top Songs" subtitle="# of Titles">hello</ContentCol>
          </Row>
        </div>
      </div>
    );
  };
};
