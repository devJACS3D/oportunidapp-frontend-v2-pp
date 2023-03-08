import { Component, OnInit } from '@angular/core';
import { COLORS, MESSAGE } from 'src/app/constants/constants';
import { ApiResponse } from '@apptypes/api-response';
import { IFilterValues } from '@apptypes/entities/IFilter';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { Api } from '@utils/api';
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss']
})

export class SocialNetworksComponent implements OnInit {
  public tableHeaders = ['Nombre', 'Fecha de expiración del token', 'Mostrar en vacantes', 'Autorización'];
  public pagination: IPagination;
  public filterParams: IFilterValues = {};
  public titlePage = `${MESSAGE.PRE_INTERVIEW}s`
  public _error: boolean;
  public loadingPage: boolean;
  public _loadingInit: boolean;
  public loading: boolean = false;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public statusId: number;
  public data: any[] = []
  public preinterviewsStatus: any;
  public currentUser: any;
  public utils = Utilities;
  public listCheckBox = [];
  public disabledSave: boolean = true;

  constructor(
    private api: Api,
    private alert: DialogService,
  ) { }
  /*------------------------------------------------------------------------------------------------------------------------
    Initialize component data
  --------------------------------------------------------------------------------------------------------------------------*/
  async ngOnInit() {
    this._loadingInit = true;
    this._error = false;
    await this.fetchData(this.filterParams);
    this._loadingInit = false;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get the api information
  --------------------------------------------------------------------------------------------------------------------------*/
  private async fetchData(params?: Object) {
    this.loadingPage = true;
    try {
      let paginatedResponse: ApiResponse = await this.api.get(Entities.socialNetworks, null, this.currentPage, this.itemsPerPage, params).toPromise();
      this.data = paginatedResponse.response.data;

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
  /*------------------------------------------------------------------------------------------------------------------------
    Pagination app
  --------------------------------------------------------------------------------------------------------------------------*/
  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;
    this.currentPage = event.pageNumber;
    await this.fetchData();
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get format date on expiresIn token
  --------------------------------------------------------------------------------------------------------------------------*/
  public getExpirationDate(social: any) {
    let message: any = ""
    if (social.tokenRequired) {
      if (social.expiresIn) {
        message = Utilities.formaDateToJSON(social.expiresIn, true)
      } else {
        message = "No hay token generado"
      }
    } else {
      message = "No Aplica"
    }
    return message
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Function for request new tokens social
  --------------------------------------------------------------------------------------------------------------------------*/
  public onGenerateToken(social: any) {
    //id of register database social
    const socialNetworks = {
      'Facebook': () => {
        console.log("Facebook");
      },
      'Twitter': () => {
        console.log("Twitter");
      },
      'Linkedin': async () => {
        this.loading = true
        try {
          const responseAuth: ApiResponse = await this.api.get(Entities.authSocialNetworks).toPromise();
          // console.log("AUTH TRAE", responseAuth);

          const autorizationLink = responseAuth.response;
          window.open(autorizationLink, "_blank");
        } catch (error) {
          console.log(error);
        }
        this.loading = false
      },
    }
    return socialNetworks[social.name]()
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get value on change input checkbox
  --------------------------------------------------------------------------------------------------------------------------*/
  public handleChange(checkbox: any, i: number) {
    this.data[i].showInVacancies = checkbox.target.checked
    this.disabledSave = false;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Save data server
  --------------------------------------------------------------------------------------------------------------------------*/
  public async saveConfig() {
    this.disabledSave = true
    try {
      await this.api.put(Entities.socialNetworks, this.data, {}).toPromise()
      this.successAlert("Redes sociales actualizadas con éxito!")
    } catch (error) {
      this.errorAlert(error)
    }
    this.disabledSave = false
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Message app
  --------------------------------------------------------------------------------------------------------------------------*/
  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    })
  }
  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    })
  }

}
