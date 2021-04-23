import React from 'react';
import "../style/SongPage.css"
import { Row } from 'react-bootstrap';
import ContentCol from "./SongCols/col"
import Sidebar from "./Sidebar";

export default class SongPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: [],
      songs: [],
      info: {}
    };
  };

  componentDidMount() {
    return null
  };

  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/song" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          Here's the timeline.
        </div>
        <div className="statsContainer">
          <Row style={{height: "100%", margin: 0}}>
            <ContentCol title="Information" subtitle="no wya">hello</ContentCol>
            <ContentCol title="Top Genres" subtitle="# of Words">
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
