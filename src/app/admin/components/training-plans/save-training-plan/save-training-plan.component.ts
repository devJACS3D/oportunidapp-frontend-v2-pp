import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from '@apptypes/api-response';
import { ITrainingPlan } from '@apptypes/entities/ITrainingPlan';
import { ISkill } from '@apptypes/entities/skill';
import { ACTIONS } from '@apptypes/enums/actions.enum';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'save-training-plan',
  templateUrl: './save-training-plan.component.html',
  styleUrls: ['./save-training-plan.component.scss']
})
export class SaveTrainingPlanComponent implements OnInit {

  //component
  header: string = 'Crear';
  public isEditing: boolean = false;
  private _isSubmitting: boolean = false;
  //observables
  skills: Observable<ISkill[]>;
  //form
  trainingPlanForm: FormGroup;
  //skills Set
  skillsSet: Set<number>;
  constructor(
    private formBuilder: FormBuilder,
    private api: Api,
    private dialog: DialogService,
    @Inject(MODAL_DATA) private data: ITrainingPlan,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference
  ) { }

  ngOnInit() {
    this.skillsSet = new Set<number>();
    this.trainingPlanForm = this.formBuilder.group({
      id: this.formBuilder.control(this.data.id),
      name: this.formBuilder.control(this.data.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      description: this.formBuilder.control(this.data.description, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
    });

    this.skills = this.api.get(Entities.skills, null, 1, 1000).pipe(
      map((res) => res.response.data)
    )

    if (this.data['type'] == ACTIONS.EDIT) {
      this.setEditMode();
    }
  }

  private setEditMode() {
    this.setSkillSetFromArray(this.data.trainingPlanSkills);
    this.header = 'Editar';
    this.isEditing = true;
  }

  private setSkillSetFromArray(arr: any[]) {
    arr.forEach(trainingPlan => {
      if (trainingPlan.skillId) {
        this.skillsSet.add(trainingPlan.skillId)
      }
    });
  }
  get isSubmitting() {
    return this._isSubmitting;
  }

  addSkill(skillId: number) {
    if (!this.skillsSet.has(skillId)) {
      return this.skillsSet.add(skillId);
    }
    this.skillsSet.delete(skillId);
    console.log(this.skillsSet);
  }


  async submit() {
    const body = { ...this.trainingPlanForm.value, skills: this.getSkillsArray(this.skillsSet) };
    let response: ApiResponse;
    try {
      if (!this.isEditing) {
        response = await this.api.post(Entities.trainingPlans, body).toPromise() as ApiResponse;
      } else {
        response = await this.api.put(Entities.trainingPlans, body, body.id).toPromise() as ApiResponse;
      }
      this.successResponse(response.message);
      this.modalRef.modalRef.close(true);
    } catch (error) {
      console.log(error);
      this.errorResponse(error);
    }
  }


  private getSkillsArray(setValue: Set<number | string>) {
    return Array.from(setValue);
  }

  /* ................................................................................................. */
  /* comparing for checkbox */
  /* ................................................................................................. */
  compareValues(skillId: number) {
    if (this.skillsSet.has(skillId)) return true;
    return false;
  }

  buttonShouldBeDisabled(): boolean {
    if (this.trainingPlanForm.invalid || this.skillsSet.size < 1 || this.isSubmitting)
      return true;
    return false;
  }
  /* ................................................................................................. */
  /* Success and error responses */
  /* ................................................................................................. */
  private successResponse(message: string) {
    this.dialog.customAlert({
      icon: COLORS.SUCCESS,
      message,
      bgColor: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    })
  }

  private errorResponse(message: string) {
    this.dialog.customAlert({
      icon: COLORS.WARNING,
      message,
      bgColor: COLORS.DANGER,
      bgBottom: true,
      autoClose: true
    })
  }



}
