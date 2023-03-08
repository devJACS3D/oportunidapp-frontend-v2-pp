import { Component, OnInit } from '@angular/core';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import {ApiResponse } from '@apptypes/api-response';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { PaymentComponent } from 'src/app/components/payment/payment.component';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  _showPaymentModal: boolean;
  _amount: any;
  _planId: any;
  _loading: any;
  public _result: any[];
  public _currentPage: number;
  public _ItemsPerPage: number;
  constructor(
    public api: Api,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private modal:ModalService,
  ) {
    this._currentPage = this.activatedRoute.snapshot.params.page;
    this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;
  }

  ngOnInit() {
    this.loadPackages();
  }

  private async loadPackages() {
    try {
      let resp: ApiResponse = await this.api.get(Entities.packages, null, this._currentPage, this._ItemsPerPage).toPromise();
      this._result = resp.response;
      let j=0;
      this._result.forEach((membership: any) => {
        let arrDescription= [];
        let strDesc = membership.description;
        console.log(strDesc)
        let flag = 0;
          for (let i = 0; i < strDesc.length; i++) {
            const c = strDesc[i];
            if( c=="\n"){
              let space = strDesc.substring(flag,(i))
              if (space != "" ) {
                arrDescription.push(strDesc.substring(flag,(i)))
              }
              flag = i+1;
            }else{
              console.log("no found \\n")
            }
            
          }
          if (flag ==0) {
            arrDescription.push(strDesc);            
          }
          console.log(arrDescription.length)
          if (flag != 0 && arrDescription.length-1 == flag ) {
            arrDescription.push(strDesc.substring(flag,strDesc.length))
          }
        this._result[j].description = arrDescription;
        j++;
      });
      console.log(this._result);
    } catch (err) {
      alert(err);
    }
    console.log('pagination: ', this._result);
  }

  public async  _savePlan(e) {
   /*  console.log(e);
    this._amount = e.price;
    this._planId = e.id;
    this._showPaymentModal = true; */
    const modal = this.modal.create(PaymentComponent,{
      data:{
        price: e.price,
        referenceId: e.id,
        onPayCloseModal: true
      }
    })

    modal.afterDestroy$.subscribe(data => this.saveTransaction(data))
  }

  public async saveTransaction(transaccion: any) {
    this._loading = true;
    try {
      // let formData = Utilities.getFormData(entityForm);  Convierte json to FormData;
      // Create Form
      let paymentResponse = await this.api.post(Entities.packagesPay, transaccion).toPromise() as ApiResponse;
      this.alert.success(paymentResponse.message);
      
    } catch (err) {
      this.alert.error(err);
    }
    this._loading = false;
  }


}
