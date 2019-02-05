import { Component, OnInit } from '@angular/core';
import { MovieDataService } from '../../services/movie-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  
  public subscription: Subscription;

  constructor(private movieDataService: MovieDataService) {}

  ngOnInit() {
  	this.movieDataService.setMoviesSubject();
  	this.subscription = this.movieDataService.getMoviesSubject()
  	.subscribe(data => this.movieDataService.movies = data)
  }

}
