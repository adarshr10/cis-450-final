import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch, 
  useParams
} from 'react-router-dom';

import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import TimelinePage from './components/TimelinePage';
import SongPage from './components/SongPage';
import LyricPage from './components/LyricPage';
import GenrePage from './components/GenrePage';
import ArtistPage from './components/ArtistPage';

import './style/PageLayout.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function SongRend(){
  let {songId} = useParams();
  return <SongPage songId={songId} />
}

function LyricRend(){
  let {lyric} = useParams();
  return <LyricPage lyric={lyric} />
}
function GenreRend(){
	let {genre} = useParams();
	return <GenrePage genre={genre} />
  }

function ArtRend(){
  let {artistName} = useParams();
  return <ArtistPage artist={artistName} />
}

function SearchRend(){
  let {lim} = useParams();
  let {gen} = useParams();
  let {low} = useParams();
  let {up} = useParams();
  let {pos} = useParams();
  let {key} = useParams();

  return <SearchPage lim={lim} gen={gen} low={low} up={up} pos={pos} key={key}/>
}

function App() {
  return (
    <div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <HomePage />}
						/>
						{/* <Route
							exact
							path="/search"
							render={() => <SearchPage />}
						/> */}

						<Route
							path="/timeline"
							render={() => <TimelinePage />}
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
