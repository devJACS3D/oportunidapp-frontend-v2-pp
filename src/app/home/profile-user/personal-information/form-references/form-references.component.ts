import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ApiResponse } from '@apptypes/api-response';
import { RegexUtils } from '@utils/regex-utils';
import { UserAccountService } from '@services/user-account.service';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { Api } from '@utils/api';
import { PersonalInformationComponent } from '../personal-information.component';


@Component({
  selector: 'app-form-references',
  templateUrl: './form-references.component.html',
  styleUrls: ['./form-references.component.scss']
})
export class FormReferencesComponent implements OnInit {
  private _idEntity: number;
  public _title: string;
  public _loading: boolean;
  public _loadingForm: boolean;
  public _Entity: any;
  public FormEntity: FormGroup;
  public _error: string = '';
  public _btnText: string;
  public _maskPhone = RegexUtils._maskPhone;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private userAccount: UserAccountService,
    private api: Api,
    private personalInfo: PersonalInformationComponent
  ) { }

  async ngOnInit() {
    this._loading = false;
    this._loadingForm = true;
    try {
      this._idEntity = this.activatedRoute.snapshot.params.id;
      if (this._idEntity) {
        const resp = await this.api.get(Entities.userPersonalReference, this._idEntity).toPromise();
        this._title = 'Actualizar';
        this._btnText = this._title;
        this._Entity = resp.response
      } else {
        this._title = 'Registrar';
        this._btnText = 'Guardar';
        this._Entity = {
          name: '',
          occupation: '',
          relationship: '',
          cellphone: '',
          address: ''
        }
      }
      this.initForm();
    } catch (err) {
      this._error = err;
    }
    this._loadingForm = false;
  }

  /* Initialice form fields */
  private initForm() {
    this.FormEntity = new FormGroup({
      name: new FormControl(this._Entity.name, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      occupation: new FormControl(this._Entity.occupation, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      relationship: new FormControl(this._Entity.relationship, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      address: new FormControl(this._Entity.address, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      cellphone: new FormControl(this._Entity.cellphone, [
        Validators.required,
        Validators.maxLength(100)
      ])
    });

  }

  public async save() {
    try {
      const entityForm: any = this.FormEntity;
      if (entityForm.valid) {
        this._loading = true;
        /* estructura json que se envia al servidor*/
        const jsonData = { ...entityForm.value }
        console.log("JSON DATA", jsonData);
      
        let saveResponse: ApiResponse;
        if (this._idEntity) {
          // Edit Form
          saveResponse = await this.api.putData(Entities.userPersonalReference, jsonData, this._idEntity).toPromise() as ApiResponse;
        } else {
          // Create Form
          // Update user
          const respUser = await this.api.get(Entities.userRegister, ' ').toPromise() as ApiResponse;
          this.userAccount.setUser(respUser.response);
          saveResponse = await this.api.postData(Entities.userPersonalReference, jsonData).toPromise() as ApiResponse;
        }
        this.alert.success(saveResponse.message);
        this.back()
      } else {
        Utilities.markAsDirty(this.FormEntity);
      }
    } catch (err) {
      this.alert.error(err);
    }
    this._loading = false;
  }

  public async back() {
    await this.personalInfo.loadEntidades()
		this.router.navigate(['home/profile/']);
	}

  /* Close modal */
  public close() {
		if (this._idEntity) {
			this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute });
		}
	}

}
