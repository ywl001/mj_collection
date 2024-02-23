import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {

  constructor() { }

  private scrollPosition: { [key: string]: number } = {};

  saveScrollPosition(key: string, position: number): void {
    this.scrollPosition[key] = position;
  }

  getScrollPosition(key: string): number {
    return this.scrollPosition[key] || 0;
  }
}
