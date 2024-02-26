import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Building, Hosing } from '../../app-type';
import {  MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GVar } from '../../global-variables';
import { User } from '../../User';
import { MatDialog } from '@angular/material/dialog';
import { BuildingComponent } from '../../components/building/building.component';
import { Subscription } from 'rxjs';
import { ScrollPositionService } from '../../services/scroll-position.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatExpansionModule, NgFor, MatButtonModule, NgIf],
  templateUrl: './building-page.component.html',
  styleUrl: './building-page.component.scss'
})
export class BuildingPageComponent {

  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;

  @ViewChild('accordionContainer',{static:false}) accordionContainer: ElementRef;

  constructor(
    private router: Router,
    // private sql: SqlService,
    private dbService:DbService,
    private location: Location,
    private dialog: MatDialog,
    private dataService: DataService,
    private scrollService:ScrollPositionService,
    route: ActivatedRoute) {
    if (!User.id) {
      this.router.navigate([''])
    }
    this.building = route.snapshot.queryParams;
    this.hosing = GVar.current_hosing;
  }

  @Input()
  building: Building = {}

  unitRoomNumbers = [];


  private buildingInfos = [];

  scrollPosition;

  hosing: Hosing;

  getBgColor(item): string {
    if(item.result_message == '0人'){
      return 'white';
    }
    if (item.result == 1) {
      return 'lightgreen'
    } else if (item.result == 0) {
      if(item.result_message == '不在家')
        return '#FFBFBF'
      return 'red'
    }
    return 'white'
  }

  private sub1: Subscription
  ngOnInit() {
    console.log('building page init')
    this.getBuildingWorkInfo().subscribe(res=>{
      console.log(res)
      this.buildingInfos = res;
    })
    this.sub1 = this.dataService.message$.subscribe(res => {
      if (res == MessageType.editBuilding) {
        console.log('编辑楼栋后刷新')
        this.getBuildingWorkInfo();
      }
    })
  }

  ngAfterViewInit(): void {
    console.log(this.accordionContainer)
    if (GVar.panelIndex >= 0) {
      this.getBuildingWorkInfo().subscribe(res=>{
        this.buildingInfos = res;
        const panelToOpen = this.panels.toArray()[GVar.panelIndex];
        panelToOpen.opened.subscribe(res=>{
          const scrollKey = 'list';
          this.scrollPosition = this.scrollService.getScrollPosition(scrollKey);
        })
        panelToOpen.open();
      })
    }
  }

  ngAfterContentChecked(): void {
    if(this.accordionContainer && this.hasScrollbar(this.accordionContainer.nativeElement)){
      if (this.scrollPosition !== undefined) {
        this.accordionContainer.nativeElement.scrollTop = this.scrollPosition;
        this.scrollPosition = undefined; // Reset scroll position after using it
      }
    }
  }

  private hasScrollbar(element: HTMLElement): boolean {
    return element.scrollHeight > element.clientHeight;
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  onScroll(event: Event): void {
    const scrollKey = 'list'; // 使用唯一的键来标识列表页
    const scrollPosition = (event.target as Element).scrollTop;
    this.scrollService.saveScrollPosition(scrollKey, scrollPosition);
    GVar.savedScrollPosition = scrollPosition;
    // console.log('scroll....',scrollPosition)
  }

  private numToArray(num) {
    return Array(num).fill(0).map((x, i) => i + 1);
  }

  onClickUnit(unit) {
    // console.log(unit)
    GVar.panelIndex = unit;
    this.unitRoomNumbers = this.createUnitArray(unit)
  }

  private createUnitArray(unit) {
    const countHome = this.building.unit_home[unit];
    let arr = [];
    for (let i = 0; i < this.building.floor; i++) {
      for (let j = 0; j < countHome; j++) {
        let roomNumber;
        if (j < 9) {
          roomNumber = `${unit + 1}-${i + 1}0${j + 1}`;
        } else {
          roomNumber = `${unit + 1}-${i + 1}${j + 1}`;
        }
        let a: any = {};
        a.room_number = roomNumber;

        for (let k = 0; k < this.buildingInfos.length; k++) {
          const b = this.buildingInfos[k];
          if (b.room_number == roomNumber) {
            a.result = b.result
            a.result_message = b.result_message
          }
        }
        arr.push(a)
      }
    }

    return arr;
  }

  private getBuildingWorkInfo() {
    return this.dbService.getBuildingWorkInfo(this.building.id)
  }

  onBack() {
    this.location.back()
  }

  onClickRoom(room) {
    //导航到person-page,building-id,room-number
    this.router.navigate(['person'], { queryParams: { building_id: this.building.id, room_number: room.room_number } })
  }

  onEditBuilding() {
    const data = Object.assign({}, this.building, { hosingId: this.hosing.id })
    this.dialog.open(BuildingComponent, { data: this.building })
  }

}
