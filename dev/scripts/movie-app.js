import React from 'react'
import ReactDOM from 'react-dom'
import { ajax } from "jquery";
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from "react-router-dom";

class Catalogue extends React.Component {
	constructor() {
		super();
		this.state = {
			movies: []
		}
	}

	componentDidMount () {
		ajax({
          url: `https://api.themoviedb.org/3/discover/movie`,
          data: {
              api_key: `f012df5d63927931e82fe659a8aaa3ac`,
              language: `en-US`,
              sort_by: `popularity.desc`,
              include_adult: `false`,
              include_video: `false`,
              page: `1`,
              primary_release_year: `2017`
            }
        	}).then((data) => {
        		console.log(data);
            this.setState({movies: data.results});
        });
			}
	render () {
		return (
			<div className="movie-catalogue">
				{this.state.movies.map((movie) => {
					return (
						<div className="movie-catalogue__movie" key={movie.id}>
							<Link to={`/movie/${movie.id}`}>
								<img src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
							</Link>
						</div>
					)
				})}
			</div>
		)
	}
}

class MovieDetails extends React.Component {
	constructor() {
		super();
		this.state = {
			movie: {} //this is an empty object, this was not a mistake
		};
	}
	componentDidMount () {
		ajax({
          url: `https://api.themoviedb.org/3/movie/${this.props.match.params.id}`,
          data: {
              api_key: 'f012df5d63927931e82fe659a8aaa3ac',
              language: 'en-US',
              sort_by: 'popularity.desc',
              include_adult: false,
              include_video: false,
              page: 1,
              primary_release_year: 2017
          }
      })
      .then((movie) => {
          this.setState({movie})
      });
    }
	render () {
		return (
			<div>
        <div className='movie-single__poster'>
            <div className='movie-single__description'>
                <header>
                    <h1>{this.state.movie.original_title}</h1>
                    <h2>{this.state.movie.tagline}</h2>
                    <p>{this.state.movie.overview}</p>
                </header>
            </div>
            <div className='movie-single__image'>
                <img src={`http://image.tmdb.org/t/p/w500/${this.state.movie.poster_path}`} />
            </div>
        </div>
    </div>
		)
	}
}

class App extends React.Component {
	render () {
		return (
			<Router>
				<div>
					<header className="top-header">
						<h1>HackFlix!</h1>
						<nav>
							<Link to="/">Catalogue</Link>
						</nav>
					</header>
					<Route exact path="/" component={Catalogue} />
					<Route path="/movie/:id" component={MovieDetails} />
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("app"));