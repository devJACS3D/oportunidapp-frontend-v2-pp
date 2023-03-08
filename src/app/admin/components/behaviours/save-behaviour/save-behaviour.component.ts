import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { ISkill } from '@apptypes/entities/skill';
import { IBehaviour } from '@apptypes/entities/test';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-save-behaviour',
  templateUrl: './save-behaviour.component.html',
  styleUrls: ['./save-behaviour.component.scss']
})
export class SaveBehaviourComponent implements OnInit {

  //component
  public title: string = 'Conducta';
  public header: string = 'Guardar conducta';
  public isSubmitting: boolean;
  //skill
  skill: ISkill;
  //form
  behavioursForm: FormGroup;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _api: Api,
    private _alert: DialogService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    const skillData = this._activatedRoute.data.pipe(map((res) => res.skill.registerDetails))
      .subscribe(res => {
        this.initForm(res);
      });
  }
  initForm(skill: ISkill) {
    this.behavioursForm = this.formBuilder.group({
      name: [skill.name, [Validators.required]],
      skillId: [skill.id, [Validators.required]],
      behaviors: this.formBuilder.array(this.setBehavioursControls(skill.behaviors))
    })
  }

  setBehavioursControls(behaviours: IBehaviour[]) {
    let controls: FormGroup[] = [];
    for (let index = 0; index < 4; index++) {
      const behaviour = behaviours[index];
      controls.push(this.formBuilder.group({
        id: [behaviour ? behaviour.id : null],
        name: [behaviour ? behaviour.name : null, [Validators.required, Validators.minLength(2)]]
      }));
    }
    return controls;
  }

  async handleSave() {
    const body = this.behavioursForm.value;
    this.isSubmitting = true;
    try {
      const response = await this._api.put(Entities.skills, body, body.skillId).toPromise() as ApiResponse;
      response.message = 'Se han actualizado exitosamente las conductas de la competencia ' + body.name;
      this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
      this._alert.success(response.message);
    } catch (error) {
      this._alert.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

}
