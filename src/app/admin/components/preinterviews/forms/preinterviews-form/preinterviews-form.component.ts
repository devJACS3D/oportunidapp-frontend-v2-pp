import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Utilities } from '@utils/utilities';
import { Api } from '@utils/api';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { PreinterviewsListComponent } from '../../preinterviews-list/preinterviews-list.component';
import { MESSAGE } from 'src/app/constants/constants';
import { ConfigEditorEnabled, ConfigEditorDisabled } from '@apptypes/classes/configEditor';

@Component({
  selector: 'app-preinterviews-form',
  templateUrl: './preinterviews-form.component.html',
  styleUrls: ['./preinterviews-form.component.scss']
})
export class PreinterviewsFormComponent implements OnInit {

  public FormEntity: FormGroup;
  public _loadingForm: boolean;
  public _loading: boolean;
  public _Entity: any;
  public _title: string;
  public _btnText: string;
  private _idEntity: number;
  public _error: string = '';
  public _showQuestions: boolean = false;
  public disabledEditor = ConfigEditorDisabled
  public enabledEditor = ConfigEditorEnabled

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alert: DialogService,
    private api: Api,
    private preinterview: PreinterviewsListComponent,
  ) { }

  ngOnInit() {
    this.initForm()
  }

  async initForm() {
    this._showQuestions = this.preinterview._showQuestions;
    this._loading = false;
    this._loadingForm = true;
    this._Entity = {
      name: '',
      question: '',
      default: false
    }
    this._title = this._btnText = MESSAGE.TEXT_CREATE;
    try {
      this._idEntity = this.activatedRoute.snapshot.params.id;
      if (this._idEntity) {
        this._btnText = MESSAGE.TEXT_UPDATE;
        this._title = MESSAGE.TEXT_EDIT
        /* if show question , seed text edit button */
        if (this._showQuestions) {
          this._btnText = this._title
        }
        const resp = await this.api.get(Entities.preinterviews, this._idEntity).toPromise();
        this._Entity = resp.response;
      }
    } catch (err) {
      this._error = err;
    }
    this._loadingForm = false;
    /* Form group data */
    this.FormEntity = new FormGroup({
      name: new FormControl(this._Entity.name, [Validators.required]),
      question: new FormControl(this._Entity.question, [Validators.required]),
      default: new FormControl(this._Entity.default, [Validators.required])
    });
  }

  /* Save and update data form pre interview */
  public async save() {
    try {
      const entityForm: any = this.FormEntity;
      if (entityForm.valid) {
        this._loading = true;
        let saveResponse: ApiResponse;
        if (this._idEntity) {
          saveResponse = await this.api.putData(Entities.preinterviews, entityForm.value, this._idEntity).toPromise() as ApiResponse;
        } else {
          saveResponse = await this.api.postData(Entities.preinterviews, entityForm.value).toPromise() as ApiResponse;
        }
        this.alert.success(saveResponse.message);
        this.back();
      } else {
        Utilities.markAsDirty(this.FormEntity);
      }
    } catch (err) {
      this.alert.error(err);
    }
    this._loading = false;
  }

  /* Go to back from modal form to pre interviews list */
  public async back() {
    this.router.navigate(['/admin/preinterviews']);
    await this.preinterview.fetchData()
    this.preinterview._showQuestions = false;
  }

  /* Close modal form */
  public close() {
    const path = this._idEntity ? '../../' : '../'
    this.router.navigate([path], { relativeTo: this.activatedRoute });
    this.preinterview._showQuestions = false;
  }

  /* Go to edit pre interview */
  public editPreInterview() {
    this._showQuestions = false;
    this._btnText = MESSAGE.TEXT_UPDATE;
  }
}
