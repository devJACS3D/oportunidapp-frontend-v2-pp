import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss']
})
export class CustomAlertComponent implements OnInit {
  /* title alert */
  public title: string;
  /* title message alert */
  public titleMessage: string;
  /* message alert */
  public message: string;
  /* type of color alert */
  public bgColor: string
  /* icon alert */
  public icon: string;
  /* close button alert */
  public closeButton: any;
  /* background top modal */
  public bgTop: boolean;
  /* background bottom modal */
  public bgBottom: boolean;
  /* array buttons */
  public buttons: any = []
  /* disable button close and buttons click  */
  public disabled: boolean
  /* close modal backgrop alert */
  public closeBackDrop: any;

  constructor() { }

  ngOnInit() {
    if (this.bgColor)
      this.bgColor = `custom-alert-${this.bgColor}`
    if (this.icon)
      this.icon = `assets/alert/${this.icon}.png`;
  }

}
