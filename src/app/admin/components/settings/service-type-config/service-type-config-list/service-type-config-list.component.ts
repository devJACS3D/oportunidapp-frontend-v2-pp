import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IServiceTypeConfig, IServiceTypeConfigMap, IServiceTypeConfigMapped, IServiceTypeMap } from '@apptypes/entities/IServiceTypeConfig';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
type dataResponse = {
  servicesTypeConfigs: IServiceTypeConfig[]
}
@Component({
  selector: 'app-service-type-config-list',
  templateUrl: './service-type-config-list.component.html',
  styleUrls: ['./service-type-config-list.component.scss']
})
export class ServiceTypeConfigListComponent implements OnInit {

  private toSave: IServiceTypeConfig[] = [];
  public isSubmitting: boolean;
  public serviceTypeConfigs: IServiceTypeConfigMapped[];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _api: Api,
    private _dialog: DialogService
  ) { }

  ngOnInit() {
    this._activatedRoute.data.subscribe((data: dataResponse) => this.setServiceTypeConfigs(data.servicesTypeConfigs));
  }


  public tableHeaders(): string[]{
    const services = this.serviceTypeConfigs[0].data.services;
    return ['Campo',...services.map(s=>s.name)];
  }

  setServiceTypeConfigs(serviceTypeConfigs: IServiceTypeConfig[]): void {
    let map = new Map<string, IServiceTypeConfigMap>();

    serviceTypeConfigs.forEach(service => {
      const exist = map.get(service.field);
      const value: IServiceTypeMap = { ...service.serviceType, fieldVisible: service.fieldVisible, entryId: service.id };
      if (!exist) {
        map.set(service.field, {
          displayName: service.displayName,
          businessTypeId: service.businessTypeId,
          services: [value]
        });
      } else {
        const prevValue = map.get(service.field);
        prevValue.services.push(value);
        map.set(service.field, {
          ...prevValue
        });
      }
    });
    this.toSave = []
    this.serviceTypeConfigs = Array.from(map, ([key, data]) => ({ key, data }));
  }

  handleChange(event: Event, stConfig: IServiceTypeConfigMapped, serviceIndex: number) {

    stConfig.data.services[serviceIndex].fieldVisible = event.target['checked'];

    const service = stConfig.data.services[serviceIndex];
    const serviceTypeConfig: IServiceTypeConfig = {
      field: stConfig.key,
      id: service.entryId,
      fieldVisible: service.fieldVisible,
      displayName: stConfig.data.displayName,
      businessTypeId: stConfig.data.businessTypeId,
      serviceTypeId: service.id
    }
    if (!this.findConfig(serviceTypeConfig.id)) {
      this.toSave.push(serviceTypeConfig);
    }
    console.log(this.toSave);
  }

  private findConfig(id: number) {
    return this.toSave.find(config => config.id === id);
  }

  async saveConfig() {
    this.isSubmitting = true;
    try {
      const result = await this._api.put(Entities.serviceTypeConfigs, { configs: this.toSave }).toPromise()
      this.toSave = []
      this._dialog.success(result.message);
    } catch (error) {
      this._dialog.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  isButtonDisabled(): boolean {

    if (this.isSubmitting || this.toSave.length <= 0)
      return true

    return false;

  }


}
