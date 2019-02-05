import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  
  @Input() movie;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  showDeleteForm() {
  	this.router.navigate(['delete/' + this.movie.id], {relativeTo: this.route})
  }

  showEditForm() {
  	this.router.navigate(['edit/' + this.movie.id], {relativeTo: this.route})
  }

}
