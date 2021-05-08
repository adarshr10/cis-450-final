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
  return <SongPage songId={songId == null ? null:decodeURIComponent(songId)} />
}

function LyricRend(){
  let {lyric} = useParams();
  return <LyricPage lyric={lyric == null ? null:decodeURIComponent(lyric)} />
}
function GenreRend(){
	let {genre} = useParams();
	return <GenrePage genre={genre == null ? null: decodeURIComponent(genre)} />
  }

function ArtRend(){
  let {artistName} = useParams();
  return <ArtistPage artist={artistName == null ? null:decodeURIComponent(artistName)} />
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
						<Route path="/song/:songId?">
                <SongRend />
            </Route>
						<Route path="/search/:lim?/:gen?/:low?/:up?/:pos?/:key?">
                <SearchRend />
            </Route>
						<Route path="/lyric/:lyric?">
              <LyricRend />
            </Route>
						<Route path="/genre/:genre?">
              <GenreRend />
            </Route>
						<Route path="/artist/:artistName?">
              <ArtRend />
            </Route>
            <Route path="*" render={() => <HomePage />} />
					</Switch>
				</Router>
			</div>    
  );
}

export default App;
