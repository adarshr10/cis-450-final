import React from 'react';
import TopWordsByGenreDiv from './HomePage/TopWordsByGenreDiv';
import TopWordsByRankAndTimeDiv from './HomePage/TopWordsByRankAndTimeDiv';
import TopGenresByRankAndTimeDiv from './HomePage/TopGenresByRankAndTimeDiv';
import TopPosOfGenreDiv from './HomePage/TopPosOfGenreDiv';
import Sidebar from './Sidebar';
import ContentCol from "./HomePage/homeCol"
import { Col, Row, Table } from 'react-bootstrap';
import '../style/HomePage.css'

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.controller = new AbortController();
    this.state = {
      // 0 — TOP LYRICS BY GENRE
      genres_0: [<option className="genresOption" value={"hello"}>{"hello"}</option>],
      genre_0: " ",
      pop_0: [],
      country_0: [],
      rb_0: [],
      custom_0: [],

      // 1 - TOP LYRICS BY DECADE
      pos_1: -1,
      low_1: -1,
      up_1: -1,
      custom_1: [],
      positions_1: [],
      decades_1: [],
      dec0_1: [],
      dec1_1: [],
      dec2_1: [],

      // 2 — TOP GENRE BY DECADE
      low_2: -1,
      up_2: -1,
      custom_2: [],
      dec0_2: [],
      dec1_2: [],
      dec2_2: [],

      // 3 — TOP GENRE RANKS BY DECADE
      low_3: -1,
      up_3: -1,
      custom_3: [],
      dec0_3: [],
      dec1_3: [],
      dec2_3: [],
    };

    this.show_0 = this.show_0.bind(this);
    this.fill_0 = this.fill_0.bind(this);
    this.handleGenreChange_0 = this.handleGenreChange_0.bind(this);

    this.show_1 = this.show_1.bind(this);
    this.fill_1 = this.fill_1.bind(this);
    this.handlePosChange_1 = this.handlePosChange_1.bind(this);
    this.handleLowChange_1 = this.handleLowChange_1.bind(this);
    this.handleUpChange_1 = this.handleUpChange_1.bind(this);
    var i;
    for (i = 0; i < 8; i++) {
      this.state.decades_1.push(<option className="genresOption" value={1950 + 10 * i}>{1950 + 10 * i}</option>);
    }
    for (i = 1; i <= 100; i++) {
      this.state.positions_1.push(<option className="genresOption" value={i}>{i}</option>);
    }

    this.show_2 = this.show_2.bind(this);
    this.fill_2 = this.fill_2.bind(this);
    this.handleLowChange_2 = this.handleLowChange_2.bind(this);
    this.handleUpChange_2 = this.handleUpChange_2.bind(this);

    this.show_3 = this.show_3.bind(this);
    this.fill_3 = this.fill_3.bind(this);
    this.handleLowChange_3 = this.handleLowChange_3.bind(this);
    this.handleUpChange_3 = this.handleUpChange_3.bind(this);
  };

  componentWillUnmount(){
    this.controller.abort();
  }

  // React function that is called when the page load.
  componentDidMount() {

    // 0 — TOP WORDS BY GENRE
    fetch("http://localhost:8080/genres/20",
      {
        method: 'GET',
        signal: this.controller.signal
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(genreList => {
        if (!genreList) return;
        console.log("NOT POSSIBLE")
        const ret = genreList.map((obj, i) =>
          <option className="genresOption" value={obj.category}>{obj.category}</option>
        );
        this.setState({
          genres_0: ret
        });
      }, err => {
        console.log(err);
      });


    this.fill_0();
    console.log(0)
    this.fill_1();
    console.log(1)
    this.fill_2();
    console.log(2)
    this.fill_3();
    console.log(3)
  };



  // 0 — TOP WORDS BY GENRE
  handleGenreChange_0(e) {
    this.setState({
      genre_0: e.target.value
    });
  };

  show_0() {

    fetch(`http://localhost:8080/home/topWordsByGenre/${this.state.genre_0}`, {
      method: 'GET',
      signal: this.controller.signal // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return this.mounted ? res.json():null;
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var counter = 1;
      var dataInfo = data.map((obj, i) =>
        <TopWordsByGenreDiv
          key={i}
          num={counter++}
          word={obj.word}
          count={obj.count.toString().substring(1)}
        />
      );

      this.setState({
        custom_0: dataInfo
      });
    });
  };


  // 1 - TOP WORDS BY RANK AND TIME
  handlePosChange_1(e) {
    this.setState({
      pos_1: e.target.value
    });
  };

  handleLowChange_1(e) {
    this.setState({
      low_1: e.target.value
    });
  };

  handleUpChange_1(e) {
    this.setState({
      up_1: e.target.value
    });
  };

  show_1() {

    fetch(`http://localhost:8080/home/topWordsByRankAndTime/${this.state.pos_1}/${this.state.low_1}/${this.state.up_1}`, {
      method: 'GET',
      signal: this.controller.signal
    }).then(res => {
      // Convert the response data to a JSON.
      return this.mounted ? res.json():null;
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var counter = 1;
      var dataInfo = data.map((obj, i) =>
        <TopWordsByRankAndTimeDiv
          key={i}
          num={counter++}
          word={obj.word}
          count={obj.count.toString().substring(1)}
        />
      );

      this.setState({
        custom_1: dataInfo
      });
    });
    
  };


  // 2
  handleLowChange_2(e) {
    this.setState({
      low_2: e.target.value
    });
  };

  handleUpChange_2(e) {
    this.setState({
      up_2: e.target.value
    });
  };

  show_2() {

    fetch(`http://localhost:8080/home/topGenresByRankAndTime/${this.state.low_2}/${this.state.up_2}`, {
      method: 'GET',
      signal: this.controller.signal
    }).then(res => {
      // Convert the response data to a JSON.
      return this.mounted ? res.json():null;
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var counter = 1;
      var dataInfo = data.map((obj, i) =>
        <TopGenresByRankAndTimeDiv
          key={i}
          num={counter++}
          category={obj.category}
          count={obj.count.toString().substring(1)}
        />
      );

      this.setState({
        custom_2: dataInfo
      });
    });
    
  };

    // 3
    handleLowChange_3(e) {
      this.setState({
        low_3: e.target.value
      });
    };
  
    handleUpChange_3(e) {
      this.setState({
        up_3: e.target.value
      });
    };
  
    show_3() {
  
      fetch(`http://localhost:8080/home/topPosOfGenre/${this.state.low_3}/${this.state.up_3}`, {
        method: 'GET',
        signal: this.controller.signal
      }).then(res => {
        // Convert the response data to a JSON.
        return this.mounted ? res.json():null;
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(data => {
        if (!data) return;
        var counter = 1;
        var dataInfo = data.map((obj, i) =>
          <TopPosOfGenreDiv
            key={i}
            num={counter++}
            category={obj.category}
            high={obj.high}
          />
        );
  
        this.setState({
          custom_3: dataInfo
        });
      });
  
  
      
    };

  render() {
    return (
      <div className="homePageContainer">
        <Sidebar curPage="/" className="sidebarContainer"></Sidebar>

        <div className="homeTimelineContainer">
          <h1 className="title">CIS 550 Final Project</h1>
          <p>Welcome to our CIS 550 Final Project, an interactive web app for analyzing the musical features, lyrical features,
            and historic Billboard performance of songs and their associated artists, genres, and more! The different pages of
            our website are as follows:
          </p>
          <ul>
            <li>
              Check out the <b>Search</b> page to search for specific songs based on keywords, genre, time ranges, and 
              Billboard ranking.
            </li>
            <li>
              The <b>Song</b> page displays a variety of information about a specific song, including audio features, top lyrics,
              similar songs, and historical Billboard performance.
            </li>
            <li>
              The <b>Lyric</b> page displays information concerning a certain song lyric. Shown on the page are
              the genres, artists, and songs which use that lyric the most. Additionally, the page displays a chart 
              showing the number of Billboard Hot 100 songs with that lyric over time.
            </li>
            <li>
              The <b>Genre</b> page displays information about a specific genre, such as popular lyrics within that genre, popular
              artists within that genre, and popular songs within that genre. The page also displays a chart showing the Billboard
              performance of that genre over time.
            </li>
            <li>
              The <b>Artist</b> page displays information about a specific artist, such as popular songs, top lyrics, and
              historical Billboard performance.
            </li>
          </ul>
          The results on each page (e.g. listed songs, artists, genres, etc.) all have hyperlinks allowing the user to
          navigate to the associated page for that result.

        </div>

        <div className="statsContainer">
          <Col style={{ height: "100%", margin: 0 }}>
            {/* QUERY 0 */}
            <ContentCol title="Top Lyrics by Genre">
              <div className="dropdown-container">
                Genre:
                  <select value={this.state.genre_0} onChange={this.handleGenreChange_0} name="dropdown" id="SearchDropDown">
                  <option value=""> </option>
                  {this.state.genres_0}
                </select>
                <button className="submit-btn" id="submitBtn" onClick={this.show_0}>Submit</button>
              </div>
              <Row style={{ height: "100%", margin: 0 }}>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>Custom</th>
                        <th>%</th>
                      </tr>
                      {this.state.custom_0}
                    </tbody>
                  </Table>
                </ContentCol>

                <ContentCol borderless>
                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>Pop</th>
                        <th>%</th>
                      </tr>
                      {this.state.pop_0}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>Country</th>
                        <th>%</th>
                      </tr>
                      {this.state.country_0}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>R&B</th>
                        <th>%</th>
                      </tr>
                      {this.state.rb_0}
                    </tbody>
                  </Table>

                </ContentCol>

              </Row>
            </ContentCol>

            {/* QUERY 1 */}
            <ContentCol title="Top Lyrics by Decade">
              <div className="dropdown-container">
              Lower decade:
                <select value={this.state.low_1} onChange={this.handleLowChange_1} name="dropdown" id="SearchDropDown">
                  <option value=" "> </option>
                  {this.state.decades_1}
                </select>
                
                Upper decade:
                <select value={this.state.up_1} onChange={this.handleUpChange_1} name="dropdown" id="SearchDropDown">
                  <option value=" "> </option>
                  {this.state.decades_1}
                </select>
                <button className="submit-btn" id="submitBtn" onClick={this.show_1}>Submit</button>
              </div>

              <Row style={{ height: "100%", margin: 0 }}>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>Custom</th>
                        <th>%</th>
                      </tr>
                      {this.state.custom_1}
                    </tbody>
                  </Table>
                </ContentCol>

                <ContentCol borderless>
                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1950-1970</th>
                        <th>%</th>
                      </tr>
                      {this.state.dec0_1}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1970-1990</th>
                        <th>%</th>
                      </tr>
                      {this.state.dec1_1}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1990-2010</th>
                        <th>%</th>
                      </tr>
                      {this.state.dec2_1}
                    </tbody>
                  </Table>

                </ContentCol>
              </Row>
            </ContentCol>


            {/* QUERY 2 */}
            <ContentCol title="Top Genres by Decade">
              <div className="dropdown-container">
              Lower decade:
                <select value={this.state.low_2} onChange={this.handleLowChange_2} name="dropdown" id="SearchDropDown">
                  <option value=" "> </option>
                  {this.state.decades_1}
                </select>

                Upper decade:
                <select value={this.state.up_2} onChange={this.handleUpChange_2} name="dropdown" id="SearchDropDown">
                  <option value=" "> </option>
                  {this.state.decades_1}
                </select>
                <button className="submit-btn" id="submitBtn" onClick={this.show_2}>Submit</button>
              </div>

              <Row style={{ height: "100%", margin: 0 }}>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>Custom</th>
                        <th>%</th>
                      </tr>
                      {this.state.custom_2}
                    </tbody>
                  </Table>
                </ContentCol>

                <ContentCol borderless>
                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1950-1970</th>
                        <th>%</th>
                      </tr>
                      {this.state.dec0_2}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1970-1990</th>
                        <th>%</th>
                      </tr>
                      {this.state.dec1_2}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1990-2010</th>
                        <th>%</th>
                      </tr>
                      {this.state.dec2_2}
                    </tbody>
                  </Table>

                </ContentCol>

              </Row>
            </ContentCol>

            {/* QUERY 3 */}
            <ContentCol title="Top Ranks of Genres by Decade">
              <div className="dropdown-container">
              Lower decade:
                <select value={this.state.low_3} onChange={this.handleLowChange_3} name="dropdown" id="SearchDropDown">
                  <option value=" "> </option>
                  {this.state.decades_1}
                </select>

                Upper decade:
                <select value={this.state.up_3} onChange={this.handleUpChange_3} name="dropdown" id="SearchDropDown">
                  <option value=" "> </option>
                  {this.state.decades_1}
                </select>
                <button className="submit-btn" id="submitBtn" onClick={this.show_3}>Submit</button>
              </div>

              <Row style={{ height: "100%", margin: 0 }}>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>Custom</th>
                        <th>Peak</th>
                      </tr>
                      {this.state.custom_3}
                    </tbody>
                  </Table>
                </ContentCol>

                <ContentCol borderless>
                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1950-1970</th>
                        <th>Peak</th>
                      </tr>
                      {this.state.dec0_3}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1970-1990</th>
                        <th>Peak</th>
                      </tr>
                      {this.state.dec1_3}
                    </tbody>
                  </Table>

                </ContentCol>

                <ContentCol borderless>

                  <Table borderless responsive="sm">
                    <tbody>
                      <tr className='headerRow'>
                        <th>#</th>
                        <th>1990-2010</th>
                        <th>Peak</th>
                      </tr>
                      {this.state.dec2_3}
                    </tbody>
                  </Table>

                </ContentCol>

              </Row>
            </ContentCol>
          </Col>
        </div>



      </div>
    );
  };




  fill_0() {

    fetch(`http://localhost:8080/home/topWordsByGenre/pop`, {
      method: 'GET',
      signal: this.controller.signal
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var counter = 1;
      var dataInfo = data.map((obj, i) =>
        <TopWordsByGenreDiv
          key={i}
          num={counter++}
          word={obj.word}
          count={obj.count.toString().substring(1)}
        />
      );

      this.setState({
        pop_0: dataInfo
      });
    });

    fetch(`http://localhost:8080/home/topWordsByGenre/country`, {
      method: 'GET',
      signal: this.controller.signal
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var counter = 1;
      var dataInfo = data.map((obj, i) =>
        <TopWordsByGenreDiv
          key={i}
          num={counter++}
          word={obj.word}
          count={obj.count.toString().substring(1)}
        />
      );

      this.setState({
        country_0: dataInfo
      });
    });

    fetch(`http://localhost:8080/home/topWordsByGenre/r&b`, {
      method: 'GET',
      signal: this.controller.signal
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(data => {
      if (!data) return;
      var counter = 1;
      var dataInfo = data.map((obj, i) =>
        <TopWordsByGenreDiv
          key={i}
          num={counter++}
          word={obj.word}
          count={obj.count.toString().substring(1)}
        />
      );

      this.setState({
        rb_0: dataInfo
      });
    });
  };




fill_1() {

  fetch(`http://localhost:8080/home/topWordsByRankAndTime/${this.state.pos_1}/1950/1970`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopWordsByRankAndTimeDiv
        key={i}
        num={counter++}
        word={obj.word}
        count={obj.count.toString().substring(1)}
      />
    );

    this.setState({
      dec0_1: dataInfo
    });
  });

  fetch(`http://localhost:8080/home/topWordsByRankAndTime/${this.state.pos_1}/1970/1990`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopWordsByRankAndTimeDiv
        key={i}
        num={counter++}
        word={obj.word}
        count={obj.count.toString().substring(1)}
      />
    );

    this.setState({
      dec1_1: dataInfo
    });
  });

  fetch(`http://localhost:8080/home/topWordsByRankAndTime/${this.state.pos_1}/1990/2010`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopWordsByRankAndTimeDiv
        key={i}
        num={counter++}
        word={obj.word}
        count={obj.count.toString().substring(1)}
      />
    );

    this.setState({
      dec2_1: dataInfo
    });
  });
};


fill_2() {

  fetch(`http://localhost:8080/home/topGenresByRankAndTime/1950/1970`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopGenresByRankAndTimeDiv
        key={i}
        num={counter++}
        category={obj.category}
        count={obj.count.toString().substring(1)}
      />
    );

    this.setState({
      dec0_2: dataInfo
    });
  });

  fetch(`http://localhost:8080/home/topGenresByRankAndTime/1970/1990`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopGenresByRankAndTimeDiv
        key={i}
        num={counter++}
        category={obj.category}
        count={obj.count.toString().substring(1)}
      />
    );

    this.setState({
      dec1_2: dataInfo
    });
  });

  fetch(`http://localhost:8080/home/topGenresByRankAndTime/1990/2010`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopGenresByRankAndTimeDiv
        key={i}
        num={counter++}
        category={obj.category}
        count={obj.count.toString().substring(1)}
      />
    );

    this.setState({
      dec2_2: dataInfo
    });
  });
};

fill_3() {

  fetch(`http://localhost:8080/home/topPosOfGenre/1950/1970`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopPosOfGenreDiv
        key={i}
        num={counter++}
        category={obj.category}
        high={obj.high}
      />
    );

    this.setState({
      dec0_3: dataInfo
    });
  });

  fetch(`http://localhost:8080/home/topPosOfGenre/1970/1990`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopPosOfGenreDiv
        key={i}
        num={counter++}
        category={obj.category}
        high={obj.high}
      />
    );

    this.setState({
      dec1_3: dataInfo
    });
  });

  fetch(`http://localhost:8080/home/topPosOfGenre/1990/2010`, {
    method: 'GET',
    signal: this.controller.signal
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(data => {
    if (!data) return;
    var counter = 1;
    var dataInfo = data.map((obj, i) =>
      <TopPosOfGenreDiv
        key={i}
        num={counter++}
        category={obj.category}
        high={obj.high}
      />
    );

    this.setState({
      dec2_3: dataInfo
    });
  });
};

};