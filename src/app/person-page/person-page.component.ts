import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
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

  building_id;
  room_number;
  
  constructor(private dataService: DataService, 
    private router: Router, 
    private route:ActivatedRoute,
    private location: Location) {
    this.building_id = route.snapshot.queryParams['building_id'];
    this.room_number = route.snapshot.queryParams['room_number'];
    console.log('person-page',this.building_id,this.room_number)
  }

  onSelectPeople(p) {
    if(this.checkPersonIsExist(p)){
      //人员已经存在
    }else{
      this.persons.unshift(p)
      //插入住所信息，工作信息
    }
  }

  ngOnInit(){
    //选择同户人员的结果
    this.dataService.selectPersons$.subscribe((res:any)=>{
      console.log('sss',res)
      this.persons = this.persons.concat(res)
    })
  }

  //获取房间人员
  private getRoomPeoples(){

  }

  checkPersonIsExist(p) {
    return this.persons.findIndex(v => v.id == p.id) > -1
  }

  onBack() {
    this.location.back()
  }

}
