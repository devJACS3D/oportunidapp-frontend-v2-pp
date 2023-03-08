import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { ItemTestSkillComponent } from './item-test-skill/item-test-skill.component';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse, ApiResponseRecords } from '@apptypes/api-response';
import { ISkill } from '@apptypes/entities/skill';
import { ISector } from '@apptypes/entities/sector';
import { Router, ActivatedRoute } from '@angular/router';
import { ITest } from '@apptypes/entities/test';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
	selector: 'app-form-tests',
	templateUrl: './form-tests.component.html',
	styleUrls: ['./form-tests.component.scss']
})
export class FormTestsComponent implements OnInit {

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;
	public FormtTest: FormGroup;

	private _idEntity: number;
	public _Entity: ITest;

	public itemsFormArray: any[] = [];
	public _skillsAll: ISkill[] = [];
	public _skillsAdds: ISkill[] = [];
	public _skills: ISkill[] = [];
	public _sectors: ISector[] = [];

	skillselect: number;
	questionFormvalid: boolean;

	body: any;
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private api: Api,
		private alert: DialogService
	) {
	}

	public async ngOnInit() {
		this._loading = false;
		this._loadingForm = true;

		this._idEntity = this.activatedRoute.snapshot.params.id;

		if (this._idEntity) {
			// Edit Form
			this._title = 'Editar Prueba';
			this._btnText = 'Actualizar';

			await this.api.get(Entities.tests, this._idEntity).toPromise().then((resp: ApiResponse) => {
				this._Entity = resp.response;

				// Trasformar el JSON para cargar datos a editar
				/**
				 *  behaviors: [
				 * 	{id: 47, name: "Competencia", skillId: 11}
				 * ]
					behaviors: (4) [{…}, {…}, {…}, {…}]
					createdAt: "2019-09-11T19:56:23.151Z"
					deletedAt: null
					id: 11
					name: "Oratoria"
					updatedAt: "2019-09-11T20:14:52.770Z"

					skillId: this.item.id,
					skillName: this.item.name,
					behaviours: 
				 */
				let skill: any;
				skill = {
					id: this._Entity.id,
					name: this._Entity.name,
					behaviors: []
				};
				skill.behaviors = [];
				//console.log('this._Entity edit', this._Entity);
				let cont: number;
				cont = 1;

				//Erwin CODE No sirve Bug reportado//
				// Correcion jeffer //
				let arrayDistincts = [];
				console.log('El array de erwin',arrayDistincts);

				//BUSCAMOS LOS DISTINTOS Y LOS PONEMOS EN EL ARRAY
				// debugger
				this._Entity.questionstest.forEach(e => {
					if (!arrayDistincts.includes(e.behavior.skillId)) {
						console.log('Elemento nuevo',e.behavior.skillId);
						arrayDistincts.push(e.behavior.skillId);
					}
				});

				
				this.fillArraySkills(arrayDistincts, skill);
				

				//==========//

				// this._Entity.questionstest.forEach(element => {
				// 	skill.behaviors.push(
				// 		{ id: element.behavior.id, name: element.behavior.name, skillId: element.behavior.skillId, questions: element.questions, feedbacks: element.feedbacks, questionsId: element.id }
				// 	)
				// 	cont = cont + 1;
				// 	if (cont > 3) {
				// 		this.addSkillToEdit(skill);
				// 		cont = 0;
				// 	}
				// });

			}, err => {
				alert(err);
			})

		} else {
			// Create Form
			this._title = 'Crear Prueba';
			this._btnText = 'Guardar';
			this._Entity = {
				name: '',
				description: '',
				sectorId: null
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

		//console.log('skillsAll ngOnInit: ', this._skillsAll);
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
		this.initForm();
	}

	addSkillMenu(e) {
		//console.log('event r', e);
		this._skills.push(e);
	}

	public initForm() {
		this.FormtTest = this.fb.group({
			questionsTest: new FormArray(
				[],
				//ItemsValidators.minQuantitySum(300)
			),
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			sectorId: new FormControl(this._Entity.sectorId, [
				Validators.required
			]),
			description: new FormControl(this._Entity.description, [
				Validators.required,
				Validators.maxLength(500)
			])
		});

		// this.itemsFormArray = this.FormtTest.get('questionsTest');

		let items: any[] = [];
		/*
		if (this._idEntity) {
			console.log('Entity to edit: ', this._Entity);
			items = this.setFormToEdit(this._Entity.questionstest);
			for (let item of items) {
				// let skill = this._skillsAll.filter(x => x.id == item.skillId)[0];
				this.itemsFormArray.push(item.skill);
			}
		}*/
		//this.setSkills();
	}

	//erwin
	fillArraySkills(arrayDistincts ,skill){
		// debugger
		//let skill:any;

		return new Promise((resolve,reject)=>{

			skill.behaviors = [];
			arrayDistincts.forEach(distinct => {
				console.log(distinct)
				let newBehaviors = [];
				for (let index = 0; index < this._Entity.questionstest.length; index++) {
					const element = this._Entity.questionstest[index];
					if (element.behavior.skillId === distinct) {
						skill.id = element.skill.id
						skill.name = element.skill.name
						newBehaviors.push(
							{ id: element.behavior.id, name: element.behavior.name, skillId: element.behavior.skillId, questions: element.questions, feedbacks: element.feedbacks, questionsId: element.id }
						);
					} 
				}
				this.addSkillToEdit(skill, newBehaviors)
			});
			//resolve(skill);
		});
	}

	addSkill(skill: ISkill, i:number) {
		
		if(!this.itemsFormArray.find(x => x.id == skill.id )){
			this.itemsFormArray.push(skill);
			this._skillsAdds.push(skill);
			this._skills.splice(i, 1);
		}
		else{
			this.alert.error('Ya se ha agregado esta competencia.');
		}
	}

	addSkillToEdit(skill, newBehaviors) {
		let newSkill = {
			id: skill.id,
			name: skill.name,
			behaviors: newBehaviors
		}
		this.itemsFormArray.push(newSkill);
	}

	public deleteItem(index) {
		this.itemsFormArray.splice(index, 1);
		//this.setSkills();
	}

	addQuestions(e) {

		console.log('e', e.body.questions);
		e.body.questions.forEach(element => {
			this.body.questionsTest.push(element);
		});
		//this.body.questionsTest.push();
	}
	invalidForm(e) {
		console.log('invalidForm', e);
		this.questionFormvalid = e;
	}
	save() {
		this.body = {
			name: this.FormtTest.get('name').value,
			description: this.FormtTest.get('description').value,
			sectorId: this.FormtTest.get('sectorId').value,
			questionsTest: []
		};
		if (this.itemsFormArray.length > 0) {
			for (let index = 0; index < this.itemsFormArray.length; index++) {
				let bt = document.getElementById('form' + index);
				bt.click();
			}
			if (this.questionFormvalid === false) {
				this.alert.error('Faltan alguna preguntas por completar');
			}
		}


		console.log('body', this.body);
		if (this.questionFormvalid === true) {
			if (this._idEntity) {
				// Editar.
				//this.setForm(form, true);
				console.log('form to edit: ', this.body);
				this.api.put(Entities.tests, this.body, this._idEntity).subscribe((resp: ApiResponse) => {
					this._loading = false;

					this.alert.success(resp.message);
					this.back();
				}, err => {
					this._loading = false;
					this.alert.error(err);
				});
			} else {
				// Guardar
				
				this.api.post(Entities.tests, this.body).subscribe((resp: ApiResponse) => {
					this._loading = false;
					console.log('resp.message', resp.message);

					this.alert.success(resp.message);
					this.back();
				}, err => {
					this._loading = false;
					this.alert.error(err);
				});
			}
		}

	}



	public back() {
		this.router.navigate(['admin/tests/']);
	}


	/*
		private setSkills() {
			let arrayItems: any[] = this.FormtTest.value.questionsTest;
			let items = arrayItems.map(x => x.skillId);
			let filterSkills = this._skillsAll.filter(x => !items.includes(x.id));
	
			this._skills = filterSkills;
		}
	
		public async save() {
			let form = this.FormtTest.value;
	
			if (this.FormtTest.valid) {
				this._loading = true;
	
	
				if (this._idEntity) {
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
			this.router.navigate(['admin/tests/']);
		}
	
		private sleep = n => new Promise(resolve => setTimeout(resolve, n));
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
		*/
}