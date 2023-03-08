import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ApiResponse } from '@apptypes/api-response';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'additional-services-form',
  templateUrl: './additional-services-form.component.html',
  styleUrls: ['./additional-services-form.component.scss']
})
export class AdditionalServicesFormComponent implements OnInit {

  $additionalServices: Observable<IAdditionalService[]>;
  @Input('services') services: FormArray;
  @Output('listChange') listChange: EventEmitter<IAdditionalService[]> = new EventEmitter();
  @Output('onError') onError: EventEmitter<any> = new EventEmitter();
  public showDetailService: boolean;
  constructor(
    private _api: Api
  ) { }

  ngOnInit() {
    this.getAdditionalServices();
  }


  private getAdditionalServices() {
    this.$additionalServices = this._api.get(Entities.additionalsServices, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data
      }),
      catchError(err => {
        this.onError.emit(err);
        throw (err);
      }));

  }

  public addOrRemove($event, service: IAdditionalService, index: number) {
    const isChecked = $event.target.checked;

    if (isChecked) {
      this.services.push(new FormGroup({
        id: new FormControl(service.id),
        price: new FormControl(Number(service.price)),
      }))
    } else if (this.findControlIndex(service.id) >= 0) {
      this.services.removeAt(this.findControlIndex(service.id));
    }
  }

  public findControlIndex(predicate) {
    return this.services.controls.findIndex((s) => s.value.id === predicate);
  }

  public detail() {
    this.showDetailService = true;
  }

  public compare(value: number) {
    const array = this.services.value as Array<IAdditionalService>;
    if (array.find(service => service.id === value)) {
      return true;
    } else {
      return false;
    }
  }

}
