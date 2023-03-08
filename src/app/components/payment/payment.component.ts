import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PaymentDto } from "@apptypes/classes/paymentDto";
import { IIdentificationType } from "@apptypes/entities/identification-type";
import {
  MODAL_DATA,
  MODAL_REFERENCE,
  IModalReference,
} from "@apptypes/IModal";
import { Entities } from "@services/entities";
import { UserAccountService } from "@services/user-account.service";
import { Api } from "@utils/api";
import { RegexUtils } from "@utils/regex-utils";
import { Utilities } from "@utils/utilities";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

interface IPaymentModalData extends Object {
  onPayCloseModal: boolean;
  referenceId?: any;
  price: number;
}

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements OnInit {
  loading$ = new Subject<boolean>();
  private _loadingText = "Procesando pago";

  _onClick = new Subject<PaymentDto>();

  public _maskPhone = RegexUtils._maskPhone;
  public _maskCard: string = "0000 0000 0000 0000";

  public FormEntity: FormGroup;
  public _validCreditCard: boolean;
  public _paymentMethod: string;

  public currentUser: any;
  public utils = Utilities;
  public documentTypes$: Observable<IIdentificationType[]>;
  constructor(
    @Inject(MODAL_DATA) public data: IPaymentModalData,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private api: Api,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this.documentTypes$ = this.api
      .get(Entities.identificationTypes, null, 1, 1000)
      .pipe(map(res => res.response.data));
    this.currentUser = this.userAccount.getUser();

    this.initForm();
  }

  @Input() set loading(status: boolean) {
    this.loading$.next(status);
  }
  @Input() set loadingText(text: string) {
    this.loadingText = text;
  }

  get clickEvent$() {
    return this._onClick.asObservable();
  }

  get loadingText() {
    return this._loadingText;
  }

  private initForm() {
    this.FormEntity = new FormGroup({
      number: new FormControl(null, [
        Validators.required,
        Validators.pattern(RegexUtils._creditCard)
      ]),
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      expirationDate: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(20)\d{2}\/(0[1-9]|10|11|12)$/)
      ]),
      securityCode: new FormControl(null, [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ]),
      contactPhone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(RegexUtils._rxPhone)
      ]),
      emailAddress: new FormControl(null, [
        Validators.required,
        Validators.pattern(RegexUtils._rxEmail),
        Validators.maxLength(60)
      ]),
      dniType: new FormControl(null, [Validators.required]),
      dniNumber: new FormControl(null, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(RegexUtils._rxNumber)
      ])
    });
  }

  public pay() {
    if (this.FormEntity.invalid) return;
    let body = this.FormEntity.value;
    const paymentBody = new PaymentDto({
      value: this.data.price,
      userId: this.currentUser.credentialCompanyId,
      referenceId: this.data.referenceId,
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
    });

    this._onClick.next(paymentBody);

    if (this.data.onPayCloseModal) {
      this.modalRef.modalRef.close(paymentBody);
    }
  }

  public setPaymentMethod() {
    this._validCreditCard = false;
    let numberCreditCard = this.FormEntity.controls.number.value;
    let stringArray = numberCreditCard.split("");
    let _count = stringArray.length;

    let paymentMethod: string;

    if (_count > 1) {
      let _first = parseInt(stringArray[0]);
      let _second = parseInt(stringArray[1]);

      switch (_first) {
        case 3:
          if (_second == 4 || _second == 7) {
            this._maskCard = "00000 00000 00000 0";

            if (_count == 15) {
              this._validCreditCard = true;
              paymentMethod = "AMEX";
            }
          } else if (_second == 6) {
            this._maskCard = "00000 00000 0000 00";
            if (_count == 14) {
              this._validCreditCard = true;
              paymentMethod = "DINERS";
            }
          } else {
            this._validCreditCard = false;
            paymentMethod = "";
          }
          break;

        case 4:
          this._maskCard = "0000 0000 0000 0000";

          if (_count == 13 || _count == 16) {
            this._validCreditCard = true;
            paymentMethod = "VISA";
          } else {
            this._validCreditCard = false;
            paymentMethod = "";
          }
          break;

        case 5:
          this._maskCard = "0000 0000 0000 0000";
          if (_second >= 1 && _second <= 4 && _count == 16) {
            this._validCreditCard = true;
            paymentMethod = "MASTERCARD";
          } else if (_second == 5 && _count == 16) {
            this._validCreditCard = true;
            paymentMethod = "DINERS";
          } else {
            this._validCreditCard = false;
            paymentMethod = "";
          }

          break;
        default:
          this._maskCard = "0000 0000 0000 0000";
          this._validCreditCard = false;
          paymentMethod = "";
      }
    }

    this._paymentMethod = paymentMethod;
  }
}
