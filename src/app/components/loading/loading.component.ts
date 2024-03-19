import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe, NgTemplateOutlet],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loading$: Observable<boolean>;


  constructor(
    private dataService: DataService) {
    this.loading$ = this.dataService.loading$;
  }

}
