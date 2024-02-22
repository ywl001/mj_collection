import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output
} from "@angular/core";
import {
  fromEvent,
  merge,
  of,
  Subscription,
  timer
} from "rxjs";
import {
  filter,
  map,
  switchMap,
  take,
  tap
} from "rxjs/operators";

@Directive({
  selector: "[longPress]",
  standalone: true
})
export class LongPressDirective implements OnDestroy {
  private eventSubscribe: Subscription;
  threshold = 500;

  @Output()
  mouseLongPress = new EventEmitter();

  private isLongPressTriggered = false;

  constructor(private elementRef: ElementRef) {
    const mousedown = fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").pipe(
      filter(event => event.button == 0),  // Only allow left button (Primary button)
      map((event) => true) // turn on threshold counter
    );
    const touchstart = fromEvent(elementRef.nativeElement, 'touchstart').pipe(map(() => true));
    const touchEnd = fromEvent(elementRef.nativeElement, 'touchend').pipe(
      tap(()=>this.isLongPressTriggered = false),
      map(() => false
      ));
    const mouseup = fromEvent<MouseEvent>(window, "mouseup").pipe(
      tap(() => this.isLongPressTriggered = false),
      filter(event => event.button == 0),  // Only allow left button (Primary button)
      map(() => false) // reset threshold counter
    );
    this.eventSubscribe = merge(mousedown, mouseup, touchstart, touchEnd)
      .pipe(
        switchMap(state =>
          state ? timer(this.threshold, 100) : of(null)
        ),
        filter(value => Boolean(value)),
      )
      .subscribe(() => {
        if (!this.isLongPressTriggered) {
          this.isLongPressTriggered = true;
          this.mouseLongPress.emit();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.eventSubscribe) {
      this.eventSubscribe.unsubscribe();
    }
  }
}