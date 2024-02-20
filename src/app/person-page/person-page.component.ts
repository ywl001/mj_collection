import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Location, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PeopleSelectComponent } from '../people-select/people-select.component';
import { People } from '../Person';
import { HomePersonComponent } from './home-person/home-person.component';

@Component({
  selector: 'app-person-page',
  standalone: true,
  imports: [MatButtonModule, PeopleSelectComponent,NgFor,HomePersonComponent],
  templateUrl: './person-page.component.html',
  styleUrl: './person-page.component.scss'
})
export class PersonPageComponent {

  persons: People[] = [];
  

  constructor(private dataService: DataService, private router: Router, private location: Location) {
  }

  onSelectPeople(p) {
    if(this.checkPersonIsExist(p)){
      //人员已经存在
    }else{
      this.persons.unshift(p)
    }
  }

  checkPersonIsExist(p) {
    return this.persons.findIndex(v => v.id == p.id) > -1
  }

  onBack() {
    this.location.back()
  }

}
