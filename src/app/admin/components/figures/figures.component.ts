import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';

@Component({
  selector: 'app-figures',
  templateUrl: './figures.component.html',
  styleUrls: ['./figures.component.scss']
})
export class FiguresComponent implements OnInit {
  _data: any;

  aplica_vacante: any;
  cliente_inscritos: any;
  prefil_activo: any;
  vc_creada_empresas: any;

  constructor(private api: Api, ) { }

  ngOnInit() {
    this.loadCifres()
  }

  async loadCifres() {
    let stateResp = await this.api.get('cifras', null, 1, 1000).toPromise();
    this._data = stateResp.response;

    this.aplica_vacante = this._data[0].aplica_vacante;
    this.cliente_inscritos = this._data[0].cliente_inscritos;
    this.prefil_activo = this._data[0].prefil_activo;
    this.vc_creada_empresas = this._data[0].vc_creada_empresas;
    console.log('_statesthis.', this._data[0]);
  }

}
