import { Component } from '@angular/core';
import { User } from '../../User';
import { CommonModule, NgFor, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorgeService } from '../../services/local-storge.service';
import { DbService } from '../../services/db.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportDataComponent } from '../../components/export-data/export-data.component';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [NgFor, MatButtonModule,ExportDataComponent],
  templateUrl: './work-page.component.html',
  styleUrl: './work-page.component.scss'
})
export class WorkPageComponent {
  works = []

  // formattedDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');

  constructor(private sql: DbService,
    private location: Location,
    private local:LocalStorgeService,
    private dialog:MatDialog,
    private router: Router) {
    if (!User.id) {
      this.router.navigate([''])
    }
  }

  ngOnInit(): void {
    this.sql.getUserWork(User.id).subscribe(res => {
      // console.log(res)
      this.works = res;
    })
  }

  back() {
    this.location.back()
  }

  onLogout(){
    this.local.clear();
    this.router.navigate(['/login'])
  }

  onExportData(){
    this.dialog.open(ExportDataComponent)
  }
}
