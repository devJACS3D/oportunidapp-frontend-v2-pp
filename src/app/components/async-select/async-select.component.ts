import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiResponse } from '@apptypes/api-response';
import { Observable, Subscription } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'async-select',
  templateUrl: './async-select.component.html',
  styleUrls: ['./async-select.component.scss']
})
export class AsyncSelectComponent implements OnInit, OnDestroy, OnChanges {

  public hasError: boolean = false;
  @Input('async-data') asyncData: Observable<ApiResponse> | any[];

  data: any;
  private $dataSubscription: Subscription;

  @Input('class') classes: string = '';
  @Input('placeholder') placeholder: string = 'Placeholder';
  @Input('name') name: string;
  @Input('label') label: string;
  @Input('defaultValue') defaultValue: string | number = null;
  @Input('selectValueFromProperty') selectValueFromProperty: string = 'id';
  @Output('onChange') onChange: EventEmitter<{ name: string, value: string | number }> = new EventEmitter();
  @Input('borderlessSelect') borderlessSelect: boolean = false;
  @Input('disabled') disabled: boolean = false;
  constructor() { }



  ngOnInit() {
    //this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['asyncData']) {
      if (changes['asyncData'].currentValue) {
        this.fetchData();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.$dataSubscription) {
      if (!this.$dataSubscription.unsubscribe) {
        this.$dataSubscription.unsubscribe();
      }
    }
  }

  public fetchData() {
    if (Array.isArray(this.asyncData)) {
      //handle data as array.
      this.data = this.asyncData;
    } else {
      this.$dataSubscription = this.asyncData.pipe(
        tap((res) => this.hasError = false),
        catchError((err) => {
          this.hasError = true;
          console.log(err);
          throw (err);
        })
      ).subscribe(res => {
        this.data = res;
      });
    }
  }

  handleChange($event) {
    const name = $event.target.name;
    const value = $event.target.value;

    this.onChange.emit({
      name,
      value
    })
  }

}
