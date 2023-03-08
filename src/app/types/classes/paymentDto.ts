export class PaymentDto {
  value: number | string;
  userId: number | string;
  referenceId: any;
  buyer: {
    merchantBuyerId: number | string;
    fullName: string;
    emailAddress: string;
    contactPhone: string;
    dniNumber: string;
  };
  payer: {
    merchantPayerId: number | string;
    fullName: string;
    emailAddress: string;
    contactPhone: string;
    dniNumber: string;
  };
  paymentMethod: string;
  userAgent: string;
  creditCard: {
    number: number | string;
    securityCode: number | string;
    expirationDate: string | Date;
    name: string;
  };


  constructor(data?: object){
      Object.assign(this,data);
  }
}
