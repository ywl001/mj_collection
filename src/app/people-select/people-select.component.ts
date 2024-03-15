import { Component, EventEmitter, Output } from '@angular/core';
import toastr from 'toastr';
import { People } from '../Person';
import { AddNewPeopleComponent } from './add-new-people/add-new-people.component';
import { PeopleItemComponent } from './people-item/people-item.component';
import { SearchComponent } from './search/search.component';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

enum peopleState {
  query,
  queryComplete,
  addNew
}

@Component({
  selector: 'app-people-select',
  standalone:true,
  imports:[AddNewPeopleComponent,PeopleItemComponent,SearchComponent,NgIf,NgFor,MatButtonModule],
  templateUrl: './people-select.component.html',
  styleUrls: ['./people-select.component.scss']
})
export class PeopleSelectComponent {

  @Output()
  selectedPeople: EventEmitter<People>=new EventEmitter();

  @Output()
  showPeoples: EventEmitter<People[]>=new EventEmitter();

  isShowQuery: boolean
  isShowPeoples: boolean
  isShowAddPeople: boolean;

  queryPeoples: People[];
  newPeople: People;

  message:string ='';

  ngOnInit() {
    this.setState(peopleState.query)
  }

  onQueryComplete(peoples: People[]) {
    this.queryPeoples = this.uniqueArray(peoples);
    console.log(this.queryPeoples)
    this.setState(peopleState.queryComplete)
  }

  onSelectPeople(p: People) {
    if (p.id > 0) {
      this.selectedPeople.emit(p);
      console.log(p)
      this.setState(peopleState.query);
    } else {
      this.newPeople = p;
      this.setState(peopleState.addNew)
    }
  }

  onCancelAddNew(){
    this.setState(peopleState.queryComplete)
  }

  onShowBigPhoto(){
    this.showPeoples.emit(this.queryPeoples)
  }

  private setState(state: peopleState) {
    if (state == peopleState.query) {
      this.setUI(true, false, false);
      this.message = '请查询需要的人员'
    } else if (state == peopleState.queryComplete) {
      this.setUI(true, true, false)
      this.message= '请从列表中选择人员，如果人员不存在，点最后的添加人员';
      toastr.info('请选择人员')
    } else if (state == peopleState.addNew) {
      this.setUI(false, false, true)
      this.message = '添加人员'
    }
  }

  private setUI(isShowQuery, isShowPeoples, isShowAddPeople) {
    this.isShowQuery = isShowQuery;
    this.isShowPeoples = isShowPeoples;
    this.isShowAddPeople = isShowAddPeople;
  }

  private uniqueArray(arr: People[]) {
    let temp = [];
    arr.forEach(p => {
      if (temp.findIndex(p2 => p.id == p2.id) == -1) {
        temp.push(p)
      }
    })
    return temp;
  }

}
