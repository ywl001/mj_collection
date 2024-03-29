import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Building, Xiaoqu, RouteParams, RouterPath, personPageData } from '../../app-type';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BuildingComponent } from '../../components/building/building.component';
import { Subscription } from 'rxjs';
import { DbService } from '../../services/db.service';
import * as XLSX from 'xlsx';
import { GlobalService } from '../../global.service';
import { RoomItemComponent } from '../../room-item/room-item.component';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatExpansionModule, MatButtonModule, RoomItemComponent],
  templateUrl: './building-page.component.html',
  styleUrl: './building-page.component.scss'
})
export class BuildingPageComponent {

  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;

  @ViewChild('accordionContainer', { static: false }) accordionContainer: ElementRef;

  constructor(
    private router: Router,
    private dbService: DbService,
    private location: Location,
    private dialog: MatDialog,
    route: ActivatedRoute,
    private gs: GlobalService) {
    if (!gs.user || !gs.current_xiaoqu) {
      this.router.navigate([''])
    }

    const { building, xqName } = gs.parseData(route.snapshot.params['building'])
    this.building = building;
    console.log(this.building)
    this.xqName = xqName;
  }

  @Input()
  building: Building = {}

  unitRoomNumbers = [];

  private buildingInfos = [];

  scrollPosition;

  xqName: string;

  // getBgColor(item): string {
  //   if(item.user_id > 10000){
  //     return 'blue'
  //   }
  //   if (item.result == 1) {
  //     return 'lightgreen'
  //   } else if (item.result == 0) {
  //     if(item.result_message == '不在家')
  //       return '#FFBFBF'
  //     return 'red'
  //   }
  //   return 'white'
  // }

  // getFontColor(item){
  //   if(item.user_id>10000){
  //     return 'white'
  //   }
  //   return null;
  // }

  private sub1: Subscription
  ngOnInit() {
    console.log('building page init')
    this.getBuildingWorkInfo().subscribe(res => {
      this.buildingInfos = res;
    })
  }

  ngAfterViewInit(): void {
    if (this.gs.panelIndex >= 0) {
      this.getBuildingWorkInfo().subscribe(res => {
        this.buildingInfos = res;
        const panelToOpen = this.panels.toArray()[this.gs.panelIndex];
        panelToOpen.opened.subscribe(res => {
          this.scrollPosition = this.gs.savedScrollPosition
        })
        panelToOpen.open();
      })
    }
  }

  ngAfterContentChecked(): void {
    if (this.accordionContainer && this.hasScrollbar(this.accordionContainer.nativeElement)) {
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
    const scrollPosition = (event.target as Element).scrollTop;
    this.gs.savedScrollPosition = scrollPosition;
  }

  // private numToArray(num) {
  //   return Array(num).fill(0).map((x, i) => i + 1);
  // }

  onClickUnit(unit) {
    console.log(unit)
    this.gs.panelIndex = unit;
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
        
        let a: personPageData = {
          roomNumber:roomNumber,
          xqName:this.xqName,
          buildingId:this.building.id,
          buildingNumber:this.building.building_number,
          type:''
        };

        for (let k = 0; k < this.buildingInfos.length; k++) {
          const b = this.buildingInfos[k];
          if (b.room_number == roomNumber) {
            a.result = b.result
            a.resultMessage = b.result_message
            a.userId = b.user_id;
          }
        }
        arr.push(a)
      }
    }

    return arr;
  }

  private getBuildingWorkInfo() {
    console.log(this.building.id)
    return this.dbService.getBuildingWorkInfo(this.building.id)
  }

  onBack() {
    this.location.back()
  }

  onExportBuildingPersons() {
    this.dbService.getUserBuildingPersons(this.building.id).subscribe(res => {
      // console.log(res)
      this.saveSheet(res)
    })
  }

  private saveSheet(arr: any[]) {
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'people');

    /* save to file */
    let fileName = this.building.building_number + '号楼人员数据'
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

}
