import { Component } from '@angular/core';
import { CommonModule, NgFor, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorgeService } from '../../services/local-storge.service';
import { DbService } from '../../services/db.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportDataComponent } from '../../components/export-data/export-data.component';
import { DataService, MessageType } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [NgFor, MatButtonModule,ExportDataComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class WorkPageComponent {
  works = []

  // formattedDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');

  constructor(private sql: DbService,
    private location: Location,
    private local:LocalStorgeService,
    private dataService:DataService,
    private dialog:MatDialog,
    private userService:UserService,
    private router: Router) {
    if (!userService.user) {
      this.router.navigate([''])
    }
  }

  ngOnInit(): void {
    this.sql.getUserWork(this.userService.user.id).subscribe(res => {
      // console.log(res)
      this.works = res;
    })
  }

  back() {
    this.location.back()
  }

  onLogout(){
    this.local.clear();
    this.userService.user = null;
    this.dataService.sendMessage(MessageType.getUserInfo)
    this.router.navigate(['/login'])
  }

  onExportData(){
    this.dialog.open(ExportDataComponent)
  }
}
