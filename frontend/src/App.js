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
						<Route path="/song/:songId?">
              <SongRend />
            </Route>
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
            <Route path="*" render={() => <HomePage />} />
					</Switch>
				</Router>
			</div>    
  );
}

export default App;
