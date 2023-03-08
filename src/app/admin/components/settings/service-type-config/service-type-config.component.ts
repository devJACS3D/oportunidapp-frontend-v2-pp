import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusinessType } from '@apptypes/entities/IBusinessType';

@Component({
  selector: 'app-service-type-config',
  templateUrl: './service-type-config.component.html',
  styleUrls: ['./service-type-config.component.scss']
})
export class ServiceTypeConfigComponent implements OnInit {

  private _businessTypes: IBusinessType[];
  tabs: string[] = ['Outsourcing', 'Temporalidad'];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._activatedRoute.data.subscribe((data: { businessTypes: IBusinessType[] }) => {
      this.businessTypes = data.businessTypes;
    })
  }

  public set businessTypes(businessTypes: IBusinessType[]) {
    this._businessTypes = businessTypes;
  }

  public get businessTypes() {
    return this._businessTypes;
  }

  handleTabChange(e) {
    if(!e) return;
    const tabValue: IBusinessType = e.value;
    this._router.navigate([`./${tabValue.id}`], { relativeTo: this._activatedRoute });
  }

}
