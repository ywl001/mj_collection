import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
