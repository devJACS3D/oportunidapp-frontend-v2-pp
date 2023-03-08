import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'card-information-user',
  templateUrl: './card-information-user.component.html',
  styleUrls: ['./card-information-user.component.scss']
})
export class CardInformationUserComponent implements OnInit {
  @Input() info: any;
  @Input() isInTramite: boolean
  @Input() message: string
  @Output() onClickEdit: EventEmitter<boolean> = new EventEmitter();
  @Output() onClickRemove: EventEmitter<boolean> = new EventEmitter();
  public title: string;
  public subTitle: string;
  public startDate: string;
  public finishedDate: string;
  constructor() { }
  /*------------------------------------------------------------------------------------------------------------------------
    Initialize info text 
  --------------------------------------------------------------------------------------------------------------------------*/
  ngOnInit() {
    this.title = this.onTitle()
    this.subTitle = this.onSubTitle()
    this.startDate = this.onStartDate()
    this.finishedDate = this.onFinishedDate()
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get Title
  --------------------------------------------------------------------------------------------------------------------------*/
  private onTitle() {
    return this.info.title || this.info.employment || "";
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get SubTitle
  --------------------------------------------------------------------------------------------------------------------------*/
  private onSubTitle() {
    return this.info.institution || this.info.company || "";
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get initialize date 
  --------------------------------------------------------------------------------------------------------------------------*/
  private onStartDate() {
    return this.info.startDate || ""
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get Finish Or Date Now
  --------------------------------------------------------------------------------------------------------------------------*/
  private onFinishedDate() {
    return this.info.finishedDate  || this.info.finishDate || ""
  }

}
