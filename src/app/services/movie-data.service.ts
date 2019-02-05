import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieDataService {
	
	public movies = null;
	public movieListUrl = 'https://api.themoviedb.org/3/list/104297?language=en-US&api_key=5846b2aa98474b5a56965508b8016f42';
	public baseImageURL = "https://image.tmdb.org/t/p/"; 
    public posterSize = "w185";
    public moviesSubject = new BehaviorSubject(null);
    public id: number = 0;

	constructor(private http: HttpClient) {}

	setMoviesSubject() {
		this.getList().subscribe(data => {
  			this.getInfo(data.items).subscribe(results => {
  				this.moviesSubject.next(this.filterAllMovies(results))
  			})
  		})			
	}

	getMoviesSubject() {
		return this.moviesSubject.asObservable();
	}

	getList(): Observable<any> {
		return this.http.get<any>(this.movieListUrl);
	}

	getInfo(moviesArray): Observable<any> {
		var observableBatch = [];
		moviesArray.map(movie => {
			observableBatch.push(
				this.http.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=5846b2aa98474b5a56965508b8016f42&append_to_response=credits`)
			)
	})
		return forkJoin(observableBatch);
	}

	filterAllMovies(data) {
		return data.map(movie => this.filterSingleMovie(movie));
	}

	filterSingleMovie(movie) {
		var directors = [];
		this.id++;
		for (var i = 2; i >= 0; i--) { //no more than 3 directors for a film
			if (movie.credits.crew[i]['job'] === 'Director') {
				directors.push(movie.credits.crew[i]['name'])
			}
		}
		var filtered_movie = {
	    	id: this.id,
	    	title: movie.title,
	    	directors: directors.join(', '),
	    	imageUrl: this.baseImageURL + this.posterSize + movie.poster_path,
	    	year: movie.release_date.slice(0, 4),
	    	genres: movie.genres.map(genre => genre.name).join(', '),
	    	runtime: movie.runtime
		};
		return filtered_movie
	}

	deleteMovie(index) {
		this.movies.splice(index, 1);
	}

	updateMovie(id, movieUpdate) {
		var index = this.movies.findIndex(movie => movie.id === id);
		this.movies[index].title = movieUpdate.title; 
		this.movies[index].directors = movieUpdate.directors;
		this.movies[index].imageUrl = movieUpdate.imageUrl;  
		this.movies[index].year = movieUpdate.year; 
		this.movies[index].genres = movieUpdate.genres; 
		this.movies[index].runtime = movieUpdate.runtime; 
	}

	createMovie(newMovie) {
		this.id++;
		newMovie.id = this.id;
		this.movies.push(newMovie);
	}
}
