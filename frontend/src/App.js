import logo from './logo.svg';
import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Recommendations from './components/Recommendations';
import BestMovies from './components/BestMovies';

import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import TimelinePage from './components/TimelinePage';
import SongPage from './components/SongPage';
import LyricPage from './components/LyricPage';
import GenrePage from './components/GenrePage';
import ArtistPage from './components/ArtistPage';

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
						<Route
							exact
							path="/search"
							render={() => <SearchPage />}
						/>
						<Route
							path="/timeline"
							render={() => <TimelinePage />}
						/>
						<Route
							path="/song"
							render={() => <SongPage />}
						/>
						<Route
							path="/lyric"
							render={() => <LyricPage />}
						/>
						<Route
							path="/genre"
							render={() => <GenrePage />}
						/>
						<Route
							path="/artist"
							render={() => <ArtistPage />}
						/>
					</Switch>
				</Router>
			</div>    
  );
}

export default App;