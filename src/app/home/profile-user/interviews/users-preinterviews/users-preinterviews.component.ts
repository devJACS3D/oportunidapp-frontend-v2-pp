import { Component, OnInit } from '@angular/core';
import { COLORS, MESSAGE, STATUS } from 'src/app/constants/constants';
import { ApiResponse } from '@apptypes/api-response';
import { IFilterValues } from '@apptypes/entities/IFilter';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';



@Component({
  selector: 'app-users-preinterviews',
  templateUrl: './users-preinterviews.component.html',
  styleUrls: ['./users-preinterviews.component.scss']
})
export class UsersPreinterviewsComponent implements OnInit {

  public pagination: IPagination;
  public filterParams: IFilterValues = {};
  public data: any[] = []
  public _error: boolean;
  public loadingPage: boolean;
  public _loadingInit: boolean;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public modalQuestion: boolean;
  public modalVideoP: boolean;
  public loadingInfo: boolean = false;
  public info: any;
  public _textNotFound = MESSAGE.NOT_FOUND
  public errorLoadingData = MESSAGE.ERROR_LOADING_DATA
  public colorStatus: Object = {
    [STATUS.UNREALIZED]: '#d6d6d6',
    [STATUS.DONE]: '#7ecc89',
  }
  public titleStatus: Object = {
    [STATUS.UNREALIZED]: 'No realizada',
    [STATUS.DONE]: 'Realizada',
  }

  constructor(
    private api: Api,
    private alert: DialogService,
  ) { }
  /*--------------------------------------------------------------------------------------------------------
   Initialize component data
  --------------------------------------------------------------------------------------------------------*/
  async ngOnInit() {
    this._loadingInit = true;
    this._error = false;
    await this.fetchData(this.filterParams);
    this._loadingInit = false;
  }
  /*--------------------------------------------------------------------------------------------------------
    Get the api information
  --------------------------------------------------------------------------------------------------------*/
  private async fetchData(params?: Object) {
    this.loadingPage = true;
    this.data = []
    try {
      let paginatedResponse: ApiResponse = await this.api.get(Entities.userPreinterviews, null, this.currentPage, this.itemsPerPage, params).toPromise();
      this.data = paginatedResponse.response.data;
      // console.log("ORIGINAL DATA", paginatedResponse.response.data);
      this.pagination = {
        pages: Utilities.recordPages(paginatedResponse.response.pagesNumber),
        pagesNumber: paginatedResponse.response.pagesNumber,
        elementsNumber: paginatedResponse.response.elementsNumber,
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage
      }
      this._error = null;
    } catch (error) {
      console.log(error);
      this._error = error;
    } finally {
      this.loadingPage = false;
    }
  }
  /*--------------------------------------------------------------------------------------------------------
     Pagination page
  --------------------------------------------------------------------------------------------------------*/
  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;
    this.currentPage = event.pageNumber;
    await this.fetchData();
  }
  /*--------------------------------------------------------------------------------------------------------
    Check if the user has uploaded a pre interview video to place the status and color
  --------------------------------------------------------------------------------------------------------*/
  public onDone(data: any, isTitle: boolean) {
    const statusId = data.videopreinterviews.length ? STATUS.DONE : STATUS.UNREALIZED;
    return isTitle ? this.titleStatus[statusId] : this.colorStatus[statusId];
  }
  /*--------------------------------------------------------------------------------------------------------
    Show the alert of the steps for the pre interview only if. has not done it yet
  --------------------------------------------------------------------------------------------------------*/
  public onShowAlert(data: any) {
    if (data.videopreinterviews.length)
      return
    this.info = data
    const alert = this.alert;
    const self = this;
    alert.customAlert({
      icon: COLORS.WARNING,
      titleMessage: '¡Tener en cuenta al realizar la Pre-Entrevista!',
      message: `En el vídeo de la Pre-Entrevista no puedes decir datos de contacto y mucho menos datos personales (Correo, celular, teléfono, documento de identidad)`,
      closeBackDrop: true,
      bgTop: true,
      bgColor: COLORS.WARNING,
      buttons: [
        {
          name: MESSAGE.TEXT_ACCEPT,
          class: 'primary-default',
          onClick() {
            alert.closeAlert()
            self.modalQuestion = true;
          }
        },
      ]
    })
  }
  /*--------------------------------------------------------------------------------------------------------
    Control questionnaire modal
  --------------------------------------------------------------------------------------------------------*/
  public onModalQuestion(modal: boolean) {
    this.modalQuestion = modal
  }
  /*--------------------------------------------------------------------------------------------------------
    Control video pre interview modal
  --------------------------------------------------------------------------------------------------------*/
  public onModalVideoPreInterview(modal: boolean) {
    this.modalVideoP = modal
  }
  /*--------------------------------------------------------------------------------------------------------
   Update the data of the list of components if they are pending, a previous interview is approved or rejected
  --------------------------------------------------------------------------------------------------------*/
  onLoadingInfo(refresh: boolean) {
    if (refresh) {
      this.fetchData(this.filterParams)
      this.modalQuestion = false;
      this.modalVideoP = false
    }
    this.loadingInfo = false;
  }

}
