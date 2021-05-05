import React from 'react';

import '../style/PageLayout.css'
import Sidebar from './Sidebar';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class TimelinePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      movies: []
    };
  };

  componentDidMount() {

  };

  // NOTE: 'timelineContainer' contains timeline in most other pages, but contains
  // drop downs here
  // TODO: maybe make select multiple
  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/timeline" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          <Form>
            <Form.Group controlID="timelineKeyword">
              <Form.Label>Keywords</Form.Label>
              <Form.Control type="text" placeholder="Artist/Album Keywords"></Form.Control>
            </Form.Group>
            <Form.Group controlID="timelineGenre">
              <Form.Label>Genre</Form.Label>
              <Form.Control as="select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlID="timelineWeeks">
              <Form.Label>No. Weeks In a Row</Form.Label>
              <Form.Control type="text">
              </Form.Control>
            </Form.Group>
            <Button variant="secondary" type="submit">
              Display Songs
            </Button>

          </Form>
        </div>
        <div className="statsContainer">
          Here are the stats.
        </div>
      </div>
    );
  };
};
