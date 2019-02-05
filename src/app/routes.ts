import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';
import { EditMovieComponent } from './components/edit-movie/edit-movie.component';
import { DeleteMovieComponent } from './components/delete-movie/delete-movie.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';

export function getRoutes(): Routes {
	return [
    	{
    		path: 'my-movie-list', component: MoviesComponent,
    			children: [
    				{ path: 'edit/:movie_id', component: EditMovieComponent  },
    				{ path: 'delete/:movie_id', component: DeleteMovieComponent  },
    				{ path: 'add', component: AddMovieComponent  }
    			]
    	},
    	{
    		path: '', redirectTo: 'my-movie-list', pathMatch: 'full'
    	},
    	{
    		path: '**', redirectTo: 'my-movie-list'
    	}
	]
}
