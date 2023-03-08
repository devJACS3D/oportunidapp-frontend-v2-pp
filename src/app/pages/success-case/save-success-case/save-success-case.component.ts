import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SuccessCaseDto } from "@apptypes/dto/successCase";
import { MODAL_DATA, MODAL_REFERENCE, IModalReference } from "@apptypes/IModal";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import Validator from 'validator';

@Component({
  selector: "app-save-success-case",
  templateUrl: "./save-success-case.component.html",
  styleUrls: ["./save-success-case.component.scss"]
})
export class SaveSuccessCaseComponent implements OnInit {

  successCaseForm: FormGroup;
  utils = Utilities;
  public file: File;
  public submitting$ = new Subject<boolean>();
  private validations = Validator;

  constructor(
    @Inject(MODAL_DATA) private data: SuccessCaseDto,
    @Inject(MODAL_REFERENCE) private ref: IModalReference,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  get title() {
    return this.data.id ? `Editar caso de éxito` : `Crear caso de éxito`;
  }

  get roles(){
    return [
      {
        id:1,
        name: "Empresas"
      },
      {
        id:2,
        name: "Trabajadores"
      },
    ]
  }

  private initForm(){
    this.successCaseForm = this.formBuilder.group({
      id: this.formBuilder.control(this.data.id),
      name: this.formBuilder.control(this.data.name,[Validators.required,Validators.minLength(2)]),
      rol: this.formBuilder.control(this.data.rol,[Validators.required]),
      comment: this.formBuilder.control(this.data.comment,[Validators.required,Validators.minLength(10)]),
      images: this.formBuilder.control(this.data.images? this.data.images[0]: null,[Validators.required]),
      video: this.formBuilder.control(this.data.video,[this.isUrl.bind(this)]),
    })
  }
  private isUrl(formControl: FormControl) {

    if (!formControl.value) return null;
    const isUrlOk = this.validations.isURL(formControl.value);

    if (!isUrlOk) {
      return {
        urlError: true
      }
    }
    return null;
  }
  public setFile(event) {
    let file = event.target.files[0];

    let reader: FileReader = new FileReader();
    if (!file.type.startsWith('image')) {
      return;
    }
    reader.onload = (e) => {
      const url = reader.result;
      this.file = file;
      this.successCaseForm.get('images').setValue(JSON.stringify({ location: url }));
    }
    reader.readAsDataURL(file);
  }

  get urlCustomError (){
    return {
      urlError: "Ingrese una url válida"
    }
  }

  save(){
    if(this.successCaseForm.invalid) return;
    this.submitting$.next(true);

    const data = Object.assign({},this.successCaseForm.value);
    if(this.file){
      data['images'] = this.file;
    }

    const formData = this.utils.getFormData(data);

    if(!this.data.id){
      return this.createSuccessCase(formData);
    }

    return this.updateSuccessCase(formData);
   

  }

  private createSuccessCase(formData:FormData){
    this.api.postData(`${Entities.v2SuccessCases}/create`,formData)
    .pipe(
      finalize(()=> this.submitting$.next(false))
    )
    .subscribe(_=> {
      this.alert.successAlert("Caso de éxito guardado exitosamente.");
      this.ref.modalRef.close(true);
    },(error)=> this.alert.errorAlert(error))
  }

  private updateSuccessCase(formData:FormData){
    this.api.putData(`${Entities.v2SuccessCases}/update`,formData,this.data.id)
    .pipe(
      finalize(()=> this.submitting$.next(false))
    )
    .subscribe(_=> {
      this.alert.successAlert("Caso de éxito guardado exitosamente.");
      this.ref.modalRef.close(true);
    },(error)=> this.alert.errorAlert(error))
  }
}
