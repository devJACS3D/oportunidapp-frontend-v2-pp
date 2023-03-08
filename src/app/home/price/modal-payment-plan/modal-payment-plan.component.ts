import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RegexUtils } from '@utils/regex-utils';
import { Utilities } from '@utils/utilities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Api } from '@utils/api';

@Component({
  selector: 'app-modal-payment-plan',
  templateUrl: './modal-payment-plan.component.html',
  styleUrls: ['./modal-payment-plan.component.scss']
})
export class ModalPaymentPlanComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() saveTransaction: EventEmitter<any> = new EventEmitter();
  @Input('loading') _loading: boolean;
  @Input('amount') _amount: number;
  @Input('vacancyId') vacancyId: number;

  public _maskPhone = RegexUtils._maskPhone;

  public FormEntity: FormGroup;
  public _maskCard: string;
  public _validCreditCard: boolean;
  public _paymentMethod: string;

  public currentUser: any;
  constructor(
    private api: Api,
    private alert: DialogService
  ) {  }

  ngOnInit() {
    this.currentUser = this.api.getCurrentUser();
    this._maskCard = '0000 0000 0000 0000';
    this.initForm();
    console.log('vacancyId', this.vacancyId);
    console.log('amu', this._amount);

  }


  public _close() {
    this.close.emit(true);
  }

  private initForm() {
    this.FormEntity = new FormGroup({
      number: new FormControl('', [
        Validators.required,
        Validators.pattern(RegexUtils._creditCard)
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      expirationDate: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(20)\d{2}\/(0[1-9]|10|11|12)$/)
      ]),
      securityCode: new FormControl('', [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ]),
      contactPhone: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(RegexUtils._rxPhone)
      ]),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.pattern(RegexUtils._rxEmail),
        Validators.maxLength(60)
      ]),
      dniNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(15)
      ])
    });
  }

  public pay() {
    if (this.FormEntity.valid) {
      try {
        let body = this.FormEntity.value;
        const paymentBody = {
          value: this._amount,
          packageId: this.vacancyId,
          buyer: {
            merchantBuyerId: this.currentUser.id,
            fullName: body.name,
            emailAddress: body.emailAddress,
            contactPhone: body.contactPhone,
            dniNumber: body.dniNumber
          },
          payer: {
            merchantPayerId: this.currentUser.id,
            fullName: body.name,
            emailAddress: body.emailAddress,
            contactPhone: body.contactPhone,
            dniNumber: body.dniNumber
          },
          paymentMethod: this._paymentMethod,
          userAgent: navigator.userAgent,
          creditCard: {
            number: body.number,
            securityCode: body.securityCode,
            expirationDate: body.expirationDate,
            name: body.name
          }
        }
        console.log('object to save transaction PLAN: ', paymentBody);

        this.saveTransaction.emit(paymentBody);

      } catch (err) {
        this.alert.error(err);
      }
    } else {
      Utilities.markAsDirty(this.FormEntity);
    }
  }

  public setPaymentMethod() {
    this._validCreditCard = false;
    let numberCreditCard = this.FormEntity.controls.number.value;
    let stringArray = (numberCreditCard).split("");
    let _count = stringArray.length;

    let paymentMethod: string;

    if (_count > 1) {
      let _first = parseInt(stringArray[0]);
      let _second = parseInt(stringArray[1]);

      switch (_first) {
        case 3:
          if ((_second == 4 || _second == 7)) {
            this._maskCard = '00000 00000 00000 0';

            if (_count == 15) {
              this._validCreditCard = true;
              paymentMethod = 'AMEX';
            }

          } else if (_second == 6) {
            this._maskCard = '00000 00000 0000 00';
            if (_count == 14) {
              this._validCreditCard = true;
              paymentMethod = 'DINERS';
            }
          } else {
            this._validCreditCard = false;
            paymentMethod = '';
          }
          break;

        case 4:
          this._maskCard = '0000 0000 0000 0000';

          if (_count == 13 || _count == 16) {
            this._validCreditCard = true;
            paymentMethod = 'VISA';
          } else {
            this._validCreditCard = false;
            paymentMethod = '';
          }
          break;

        case 5:
          this._maskCard = '0000 0000 0000 0000';
          if ((_second >= 1 && _second <= 4) && _count == 16) {
            this._validCreditCard = true;
            paymentMethod = 'MASTERCARD';
          } else if (_second == 5 && _count == 16) {
            this._validCreditCard = true;
            paymentMethod = 'DINERS';
          } else {
            this._validCreditCard = false;
            paymentMethod = '';
          }

          break;
        default:
          this._maskCard = '0000 0000 0000 0000';
          this._validCreditCard = false;
          paymentMethod = '';
      }
    }

    this._paymentMethod = paymentMethod;
  }
}
