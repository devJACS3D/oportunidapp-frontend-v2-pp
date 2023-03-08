import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse, ApiResponseRecords } from '@apptypes/api-response';
import { ISkill } from '@apptypes/entities/skill';
import { ISector } from '@apptypes/entities/sector';
import { Router, ActivatedRoute } from '@angular/router';
import { ITest, IBehaviors } from '@apptypes/entities/test';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ItemBehaviorsComponent } from './item-behaviors/item-behaviors.component';

@Component({
  selector: 'app-form-behaviors',
  templateUrl: './form-behaviors.component.html',
  styleUrls: ['./form-behaviors.component.scss']
})
export class FormBehaviorsComponent implements OnInit {

  public _title: string;
  public _btnText: string;

  public _loading: boolean;
  public _loadingForm: boolean;
  public FormtTest: FormGroup;

  public _id: number;
  public _name: string;

  private _idEntity: number;
  public _Entity: ITest;
  public _EntityBehaviors: IBehaviors;


  public itemsFormArray: any;
  public _skillsAll: ISkill[] = [];
  public _skills: ISkill[] = [];
  public _sectors: ISector[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private api: Api,
    private alert: DialogService
  ) {



    let edit = this.activatedRoute.snapshot.params.edit;
    if (edit) {
      let data;
      data = JSON.parse(sessionStorage.getItem('saveLocabeh'));
      console.log('data[0].name0', data[0].name);

      this.FormtTest = this.fb.group({
        name: [data[0].name, [Validators.required, Validators.minLength(2)]],
        name2: [data[1].name, [Validators.required, Validators.minLength(2)]],
        name3: [data[2].name, [Validators.required, Validators.minLength(2)]],
        name4: [data[3].name, [Validators.required, Validators.minLength(2)]],
      });

      this.getLocabeh();

    } else {
      this.FormtTest = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        name2: ['', [Validators.required, Validators.minLength(2)]],
        name3: ['', [Validators.required, Validators.minLength(2)]],
        name4: ['', [Validators.required, Validators.minLength(2)]],
      });
    }
  }

  public async ngOnInit() {
    this._loading = false;
    this._loadingForm = true;

    this._id = this.activatedRoute.snapshot.params.id;
    this._name = this.activatedRoute.snapshot.params.name;

    if (this._idEntity) {
      // Edit Form
      this._title = 'Editar Conducta';
      this._btnText = 'Actualizar';



      await this.api.get(Entities.tests, this._idEntity).toPromise().then((resp: ApiResponse) => {
        this._Entity = resp.response;
      }, err => {
        alert(err);
      })

    } else {
      // Create Form
      this._title = 'Crear Conducta';
      this._btnText = 'Guardar';

      this._EntityBehaviors = {
        name: '',
        id: null
      }
    }

    await this.api.get(Entities.skills, null, 1, 100).toPromise().then(
      (resp: ApiResponse) => {
        let records: ApiResponseRecords<any> = resp.response;
        this._skillsAll = records.data;
        this._skills = records.data;
        // this.setSkills();

      }, err => {
        alert(err);
      }
    );

    console.log('skillsAll ngOnInit: ', this._skillsAll);
    // this.initForm();

    await this.api.get(Entities.sectors, null, 1, 100).toPromise().then(
      (resp: ApiResponse) => {
        let records: ApiResponseRecords<any> = resp.response;

        //this._loadingForm = false;
        this._sectors = records.data;
      }, err => {
        alert(err)
      }
    )

    this._loadingForm = false;
  }

  public initForm() {

    this.itemsFormArray = this.FormtTest.get('questionsTest');

    let items: any[] = [];
    if (this._idEntity) {
      console.log('Entity to edit: ', this._Entity);
      items = this.setFormToEdit(this._Entity.questionstest);
      for (let item of items) {
        // let skill = this._skillsAll.filter(x => x.id == item.skillId)[0];
        this.itemsFormArray.push(ItemBehaviorsComponent.buildToEdit(item, item.skill));
      }
    }

    this.getLocabeh();
  }

  public async addSkill(skill: ISkill) {
    this.itemsFormArray.push(ItemBehaviorsComponent.buildItem(skill));
    await this.sleep(250);
    document.querySelector(".site").scrollTop = document.querySelector('.site').scrollHeight;
  }

  public async save() {
    let body;
    let form = this.FormtTest.value;
    let edit = this.activatedRoute.snapshot.params.edit;
    console.log('form to edit: ', form);

    if (this.FormtTest.valid) {

      if (edit) {
        let data;
        data = JSON.parse(sessionStorage.getItem('saveLocabeh'));

        body = {
          "name": this._name,
          "behaviors": [
            { "id": data[0].id, "name": form.name },
            { "id": data[1].id, "name": form.name2 },
            { "id": data[2].id, "name": form.name3 },
            { "id": data[3].id, "name": form.name4 }
          ]
        }

      } else {
        body = {
          "name": this._name,
          "behaviors": [
            { "name": form.name },
            { "name": form.name2 },
            { "name": form.name3 },
            { "name": form.name4 }
          ]
        }
      }

      this._loading = true;


      console.log('form to  b: ', body);

      this.api.put(Entities.skills, body, this._id).subscribe((resp: ApiResponse) => {
        this._loading = false;
        resp.message = 'Se han actualizado exitosamente las conductas de la competencia ' + this._name;
        this.alert.success(resp.message);
        this.back();
      }, err => {
        this._loading = false;
        this.alert.error(err);
      });


      /*      if (this._idEntity) {
              // Editar.
              this.setForm(form, true);
              console.log('form to edit: ', form);
      
              this.api.put(Entities.tests, form, this._idEntity).subscribe((resp: ApiResponse) => {
                this._loading = false;
      
                this.alert.success(resp.message);
                this.back();
              }, err => {
                this._loading = false;
                this.alert.error(err);
              });
      
            } else {
              // Guardar 
              this.setForm(form, false);
              this.api.post(Entities.tests, form).subscribe((resp: ApiResponse) => {
                this._loading = false;
      
                this.alert.success(resp.message);
                this.back();
              }, err => {
                this._loading = false;
                this.alert.error(err);
              });
            }
      */
      this._loading = false;
    }
  }


  private setForm(form: any, edit: boolean) {

    let questionsTest: any[] = form.questionsTest;
    let questionsTestForm: any[] = [];

    questionsTest.forEach(obj => {
      let questions: string[] = [obj.question_1, obj.question_2, obj.question_3, obj.question_4, obj.question_5];
      let feedbacks: string[] = [obj.feedback_1, obj.feedback_2, obj.feedback_3];
      if (edit && obj.id)
        questionsTestForm.push({ id: obj.id, skillId: obj.skillId, questions, feedbacks });
      else
        questionsTestForm.push({ skillId: obj.skillId, questions, feedbacks });
    });

    form.questionsTest = questionsTestForm;
  }

  private setFormToEdit(arrayTest: any[]) {
    let itemsQuestion: any[] = [];
    arrayTest.forEach(obj => {
      let test = {
        // skillId: obj.skillId,
        id: obj.id,
        question_1: obj.questions[0],
        question_2: obj.questions[1],
        question_3: obj.questions[2],
        question_4: obj.questions[3],
        question_5: obj.questions[4],
        feedback_1: obj.feedbacks[0],
        feedback_2: obj.feedbacks[1],
        feedback_3: obj.feedbacks[2],
        skill: obj.skill
      }
      itemsQuestion.push(test);
    });
    return itemsQuestion;
  }

  public back() {
    this.router.navigate(['/admin/behaviors/1/9']);
  }

  getLocabeh() {
    let name = this.activatedRoute.snapshot.params.edit;
    console.log('name', name);
    if (name) {
      // editar


      let data;
      if (sessionStorage.getItem('saveLocabeh')) {
        data = JSON.parse(sessionStorage.getItem('saveLocabeh'));
        this.FormtTest.controls['name'].setValue(data[0].name);
        this.FormtTest.controls['name2'].setValue(data[1].name);
        this.FormtTest.controls['name3'].setValue(data[2].name);
        this.FormtTest.controls['name4'].setValue(data[3].name);
      }
    } else {
      sessionStorage.removeItem('saveLocabeh');
    }

  }

  private sleep = n => new Promise(resolve => setTimeout(resolve, n));

  get f() {
    return this.FormtTest.controls;
    //return this.FormtTest.get('name');
  }
}


// Example validate global form
class ItemsValidators {
  static minQuantitySum(val: number) {
    return ((c: AbstractControl) => {
      let sum = c.value
        .map(item => item.quantity)
        .reduce((acc, cur) => acc + cur, 0);
      if (sum < val) {
        return { minSum: val }
      }
    })
  }
}

