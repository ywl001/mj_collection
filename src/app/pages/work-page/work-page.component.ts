import { Component } from '@angular/core';
import { SqlService } from '../../services/sql.service';
import { User } from '../../User';
import { CommonModule, NgFor, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorgeService } from '../../services/local-storge.service';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [NgFor, MatButtonModule],
  templateUrl: './work-page.component.html',
  styleUrl: './work-page.component.scss'
})
export class WorkPageComponent {
  works = []

  // formattedDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');

  constructor(private sql: SqlService,
    private location: Location,
    private local:LocalStorgeService,
    private router: Router) {
    if (!User.id) {
      this.router.navigate([''])
    }
  }

  ngOnInit(): void {
    this.sql.getUserWork(User.id).subscribe(res => {
      console.log(res)
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
}
