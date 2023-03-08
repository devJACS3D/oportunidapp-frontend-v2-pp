import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';

@Component({
  selector: 'social-network',
  templateUrl: './social-network.component.html',
  styleUrls: ['./social-network.component.scss']
})
export class SocialNetworkComponent implements OnInit {

  @Input('formGroup') formGroup: FormGroup
  @Input('title') title: string
  @Output('handleChange') emitter: EventEmitter<{ id: string, value: boolean }> = new EventEmitter();
  public socialNetworks: any = []

  constructor(private api: Api) { }

  ngOnInit() {
    this.getSocialNetworks()
  }

  handleEmit($event) {
    this.emitter.emit({ id: $event.target.id, value: $event.target.checked })
  }

  async getSocialNetworks() {
    try {
      let socialNetworks: ApiResponse = await this.api.get(Entities.socialNetworks, null, 1, 1000, { showInVacancies: true }).toPromise();
      this.socialNetworks = socialNetworks.response.data;
    } catch (error) { }
  }

}
