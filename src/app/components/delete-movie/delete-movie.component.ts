import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MovieDataService } from '../../services/movie-data.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-delete-movie',
  templateUrl: './delete-movie.component.html',
  styleUrls: ['./delete-movie.component.css']
})
export class DeleteMovieComponent implements OnInit {
	public subscription: Subscription;
	public movie;
	constructor(private route: ActivatedRoute, private router: Router, private movieDataService: MovieDataService) { }

    ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			if (!this.movieDataService.movies) {
				this.subscription = this.movieDataService.getMoviesSubject().subscribe(data => {
					if (data) { 
						this.movieDataService.movies = data; 
						this.movie = this.movieDataService.movies.find(movie => movie.id === Number(params.get('movie_id')));
					}
				});
			} else {
				this.movie = this.movieDataService.movies.find(movie => movie.id === Number(params.get('movie_id')));
			}
		});
    }

  	closePopup() {
  		this.router.navigate(['/my-movie-list']);
  	}


  	modalClick($event) {
  		$event.target == document.querySelector('.popup_container') ?
  			this.closePopup() : "";
  	}
  

	onSubmit(form: NgForm) {
		var index = this.movieDataService.movies.findIndex(movie => movie.id === this.movie.id);
		this.movieDataService.deleteMovie(index);
		this.closePopup();
	}
}
