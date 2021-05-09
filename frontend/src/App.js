import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch, 
  useParams,
  useHistory
} from 'react-router-dom';
import {Spinner} from 'react-bootstrap';


import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import SongPage from './components/SongPage';
import LyricPage from './components/LyricPage';
import GenrePage from './components/GenrePage';
import ArtistPage from './components/ArtistPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function SongRend(){
  let {songId} = useParams();
  const propInp = songId == null ? null:decodeURIComponent(songId);
  return <SongPage songId={propInp} key={propInp} />
}

function LyricRend(){
  let {lyric} = useParams();
  const propInp = lyric == null ? null:decodeURIComponent(lyric);
  return <LyricPage lyric={propInp} key={propInp} />
}
function GenreRend(){
	let {genre} = useParams();
  const propInp = genre == null ? null:decodeURIComponent(genre);
	return <GenrePage genre={propInp} key={propInp} />
  }

function ArtRend(){
  let {artistName} = useParams();
  const propInp = artistName == null ? null:decodeURIComponent(artistName);
  return <ArtistPage artist={propInp} key={propInp} />
}

function SearchRend(){
  let {lim, gen, low, up, pos, key} = useParams();

  return <SearchPage lim={lim} gen={gen} low={low} up={up} pos={pos} key={key==null ? null:decodeURIComponent(key)}/>
}

function App() {
  const history = useHistory();
  return (
    <div className="App">
        <div id="spinner-div" className="d-none"><Spinner id="spinner-obj" animation="grow" variant="success" /></div>
				<Router history={history}>
					<Switch>
						<Route
							exact
							path="/"
							component={HomePage}
						/>
            {/* <Route exact path="/song"><SongPage songId={null} /> </Route> */}
						<Route path="/song/:songId?" component={SongRend} />

						<Route path="/search/:lim?/:gen?/:low?/:up?/:pos?/:key?" component={SearchRend} />

            {/* <Route exact path="/lyric"><LyricPage lyric={null} /> </Route> */}
						<Route path="/lyric/:lyric?" component={LyricRend} />

            {/* <Route exact path="/genre"><GenrePage genre={null} /> </Route> */}
						<Route path="/genre/:genre?" component={GenreRend} />

            {/* <Route exact path="/artist"><ArtistPage songId={null} /> </Route> */}
						<Route path="/artist/:artistName?" component={ArtRend} />
            <Route path="*" render={() => <HomePage />} />
					</Switch>
				</Router>
			</div>    
  );
}

export default App;
