import React from 'react';
import '../style/SearchPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/PageLayout.css'
import Sidebar from './Sidebar';
import ContentCol from "./SearchPage/searchCol"

import { Row, Table, Form, Button, Col} from 'react-bootstrap';
import SearchDiv from './SearchPage/SearchDiv';

// TODO: EDIT AND MODIFY AS NEEDED. (will need to do lots of modifications)
export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      songs: [],
      genres: [<option className="genresOption" value={"hello"}>{"hello"}</option>],
      decades: [],
      positions: [],

      limit: -1,
      genre: " ",
      lower: -1,
      upper: -1,
      position: -1,
      keyword: " "
    };
    var i;
    for (i = 0; i < 8; i++) {
      this.state.decades.push(<option className="genresOption" value={1950 + 10 * i}>{1950 + 10 * i}</option>);
    }
    for (i = 1; i <= 100; i ++) {
      this.state.positions.push(<option className="genresOption" value={i}>{i}</option>);
    }

    this.showSongs = this.showSongs.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleLowerChange = this.handleLowerChange.bind(this);
    this.handleUpperChange = this.handleUpperChange.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.handleKeywordChanged = this.handleKeywordChanged.bind(this);
  };

  componentDidMount() {
    //this.showSongs();

    fetch("http://localhost:8080/genres/50",
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(genreList => {
      if (!genreList) return;
      const ret = genreList.map((obj, i) =>
	 	 <option className="genresOption" value={obj.category} key={i}>{obj.category}</option>
      );
      this.setState({
        genres: ret
	  });
    }, err => {
      console.log(err);
    });	
  };

  handleGenreChange(e) {
		this.setState({
			genre: e.target.value
		});
	};

  handleLowerChange(e) {
		this.setState({
			lower: e.target.value
		});
	};

  handleUpperChange(e) {
		this.setState({
			upper: e.target.value
		});
	};

  handlePositionChange(e) {
		this.setState({
			position: e.target.value
		});
	};

  handleKeywordChanged(e) {
		this.setState({
			keyword: e.target.value
		});
	};

  showLoader(){
    document.getElementById("spinner-div").classList.remove("d-none");
  }

  hideLoader(){
    document.getElementById("spinner-div").classList.add("d-none");
  }

  showSongs(event) {
    event.preventDefault();
    this.showLoader();
    fetch(`http://localhost:8080/searchData/${this.state.limit}/${this.state.genre}/${this.state.lower}/${this.state.upper}/${this.state.position}/${this.state.keyword}`, {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var dataInfo = data.map((obj, i) =>
        <SearchDiv 
          key = {i}
          id={obj.id}
          title={obj.title}
          performer={obj.performer}
          ranking={obj.position}
          genres={obj.genre}
        /> 
      );
      
      this.setState({
        songs: dataInfo
      });
      this.hideLoader()
    });
  };


ç
  render() {    
    return (
      <div className="pageContainer">
        <Sidebar curPage="/search" className="sidebarContainer"></Sidebar>

        <div className="timelineContainer">
          <h1 className="title">
            Search for Songs!
          </h1>
          {/*
          <div className="dropdown-container">
          Keywords:
							<input type='text' placeholder="Keywords" value={this.state.keyword} onChange={this.handleKeywordChanged} id="keyName" className="key-input"/>
					</div>

          <div className="dropdown-container">
              genre: 
              <select value={this.state.genre} onChange={this.handleGenreChange} name="dropdown" id="SearchDropDown">
              <option value=""> </option>
              {this.state.genres}
							</select>
          </div>

          <div className="dropdown-container">
              lower decade: 
              <select value={this.state.lower} onChange={this.handleLowerChange} name="dropdown" id="SearchDropDown">
              <option value=" "> </option>
              {this.state.decades}
							</select>
          </div>

          <div className="dropdown-container">
              upper decade: 
              <select value={this.state.upper} onChange={this.handleUpperChange} name="dropdown" id="SearchDropDown">
              <option value=" "> </option>
              {this.state.decades}
							</select>
          </div>

          <div className="dropdown-container">
          billboard ranking: 
              <select value={this.state.position} onChange={this.handlePositionChange} name="dropdown" id="SearchDropDown">
              <option value=" "> </option>
              {this.state.positions}
							</select>
          </div>

          <button className="submit-btn" id="submitBtn" onClick={this.showSongs}>Submit</button>*/}
          <div className="formContainer">

            <Form onSubmit={this.showSongs}>
              <Row>
                <Col>
                  <Form.Group controlId="searchKeyword">
                    <Form.Label>Keywords</Form.Label>
                    <Form.Control type="text" placeholder="Artist/Album Keywords" onChange={this.handleKeywordChanged}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="searchGenre">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control as="select" onChange={this.handleGenreChange}>
                      <option key={0} value=" "></option>
                      {this.state.genres}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="searchLower">
                  <Form.Label>Lower Decade</Form.Label>
                  <Form.Control as="select" onChange={this.handleLowerChange}>
                    <option key={0} value=" "></option>
                    {this.state.decades}
                  </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="searchUpper">
                  <Form.Label>Upper Decade</Form.Label>
                  <Form.Control as="select" onChange={this.handleUpperChange}>
                    <option key={0} value=" "></option>
                    {this.state.decades}
                  </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="searchBillboard">
                    <Form.Label>Billboard Ranking</Form.Label>
                    <Form.Control as="select" onChange={this.handlePositionChange}>
                      <option key={0} value=" "></option>
                      {this.state.positions}
                    </Form.Control>
                  </Form.Group>              
                </Col>
              </Row>
              <Button variant="secondary" type="submit">
                Find Songs
              </Button>

            </Form>
          </div>
        </div>
        <div className="statsContainer">
          <Row style={{height: "100%", margin: 0}}>
          <ContentCol title="Search Results">
              <Table borderless responsive="sm">
                <tbody>
                  <tr className='headerRow'>
                    <th>Title</th>
                    <th>Performer</th>
                    <th>Top Ranking</th>
                    <th>Genres</th>
                  </tr>
                  {this.state.songs}
                </tbody>
              </Table>
            </ContentCol>
          </Row>
        </div>
      </div>
    );
  };
};
