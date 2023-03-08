import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostDto } from '@apptypes/dto/post';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-save-post',
  templateUrl: './save-post.component.html',
  styleUrls: ['./save-post.component.scss']
})
export class SavePostComponent implements OnInit {

  postForm: FormGroup;
  utils = Utilities;
  public file: File;
  public submitting$ = new Subject<boolean>();
  constructor(
     @Inject(MODAL_DATA) private data: PostDto,
     @Inject(MODAL_REFERENCE) private ref: IModalReference,
     private formBuilder:FormBuilder,
     private api:Api,
     private alert:DialogService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  get title(){
    return this.data.id? `Editar blog`: `Crear blog`
  }

  private initForm(){
    this.postForm = this.formBuilder.group({
      id: this.formBuilder.control(this.data.id),
      name: this.formBuilder.control(this.data.name,[Validators.required,Validators.minLength(5)]),
      author: this.formBuilder.control(this.data.author,[Validators.required,Validators.minLength(2)]),
      aboutAuthor: this.formBuilder.control(this.data.aboutAuthor,[Validators.required,Validators.minLength(5)]),
      description: this.formBuilder.control(this.data.description,[Validators.required,Validators.minLength(10)]),
      images: this.formBuilder.control(this.data.images? this.data.images[0]: null,[Validators.required]),
    })
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
      this.postForm.get('images').setValue(JSON.stringify({ location: url }));
    }
    reader.readAsDataURL(file);
  }

  save(){
    if(this.postForm.invalid) return;
    this.submitting$.next(true);

    const data = Object.assign({},this.postForm.value);
    if(this.file){
      data['images'] = this.file;
    }

    const formData = this.utils.getFormData(data);

    if(!this.data.id){
      return this.createPost(formData);
    }

    return this.updatePost(formData);
   

  }

  private createPost(formData:FormData){
    this.api.postData(`${Entities.v2Blog}/create`,formData)
    .pipe(
      finalize(()=> this.submitting$.next(false))
    )
    .subscribe(res=> {
      this.alert.successAlert("Blog guardado exitosamente.");
      this.ref.modalRef.close(true);
    },(error)=> this.alert.errorAlert(error))
  }

  private updatePost(formData:FormData){
    this.api.putData(`${Entities.v2Blog}/update`,formData,this.data.id)
    .pipe(
      finalize(()=> this.submitting$.next(false))
    )
    .subscribe(res=> {
      this.alert.successAlert("Blog guardado exitosamente.");
      this.ref.modalRef.close(true);
    },(error)=> this.alert.errorAlert(error))
  }

}
