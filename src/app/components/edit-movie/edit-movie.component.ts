import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MovieDataService } from '../../services/movie-data.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
	public subscription: Subscription;
	public movie;
	public movieIndex;
	public errors = {
		validTitleName: false,
		validTitleDuplicity: false,
		validDirectors: false,
		validYear: false,
		validGenres: false,
		validRuntime: false
	}

	constructor(private route: ActivatedRoute, private router: Router, private movieDataService: MovieDataService) { }

	ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			if (!this.movieDataService.movies) {
				this.subscription = this.movieDataService.getMoviesSubject().subscribe(data => {
					if (data) { 
						this.movieDataService.movies = data; 
						this.movieIndex = this.movieDataService.movies.findIndex(movie => movie.id === Number(params.get('movie_id')));
						this.movie = this.movieDataService.movies[this.movieIndex];
					}
				});
			} else {
				this.movieIndex = this.movieDataService.movies.findIndex(movie => movie.id === Number(params.get('movie_id')));
				this.movie = this.movieDataService.movies[this.movieIndex];
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
		this.resetErrors();
		if (form.valid) {
			this.validateTitle(form.value.title);
			this.validateDirectors(form.value.directors);
			this.validateYear(form.value.year);
			this.validateGenres(form.value.genres);
			this.validateRuntime(form.value.runtime);
			if (this.validateOverall()) {
				var img = document.querySelector('.image'); 
				if (img instanceof HTMLImageElement) {
			   		form.value.imageUrl = img.src;
			   		console.log('It\'s over');
			  		this.movieDataService.updateMovie(this.movie.id, form.value)
			  		this.closePopup()
				}
			}
		}
	}

	updateImage($event) {
		var img = document.querySelector('.image'); 
		if (img instanceof HTMLImageElement) {
			img.src = $event.target.value;
		}	
	}

	defaultImage($event) {
		$event.target.src = "assets/images/image_error_poster.jpg";
	}
  
	resetErrors() {
		for (var property in this.errors) {
  			this.errors[property] = false;
		}
	}

	validateTitle(title) {
		if (!(/^([A-Za-z][A-Za-z0-9 ,':.-]+)$/.test(title))) {
			this.errors.validTitleName = true;
		} else {
			var duplicity = this.movieDataService.movies
				.filter((movie, i) => 
					title.toLowerCase() === movie.title.toLowerCase() && i !== this.movieIndex
				).length;
			if (duplicity === 1) {
				this.errors.validTitleDuplicity = true;
			}
		}
	}


	validateDirectors(directors) {
		(!(/^([A-Za-z][A-Za-z ,':.]+)$/.test(directors))) ? this.errors.validDirectors = true : "";
		
	}

	validateGenres(genres) {
		(!(/^([A-Za-z][A-Za-z ,':.]+)$/.test(genres))) ? this.errors.validGenres = true : "";
	}

	validateYear(year) {
		( 
			Number(year) > 2020 || 
		    Number(year) < 1900 || 
		    !(/^(\d{4})$/.test(year))
		) 

		? this.errors.validYear = true : "";
	}

	validateRuntime(runtime) {
		(
			Number(runtime) > 260 || 
			Number(runtime) < 15  ||
			!(/^(\d{2,3})$/.test(runtime))
		) 

		? this.errors.validRuntime = true : "";
	}

	validateOverall() {
		return (Object.values(this.errors).indexOf(true) > -1) ? false : true;
	}
}
