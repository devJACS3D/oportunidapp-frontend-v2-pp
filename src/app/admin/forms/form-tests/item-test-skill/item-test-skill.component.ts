import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ISkill } from '@apptypes/entities/skill';

@Component({
	selector: 'app-item-test-skill',
	templateUrl: './item-test-skill.component.html',
	styleUrls: ['./item-test-skill.component.scss']
})
export class ItemTestSkillComponent implements OnInit {

	@Input()
	public index: number;

	@Input('item')
	public item: any;

	form: FormGroup;
	questions: FormArray;

	@Output()
	public removed: EventEmitter<number> = new EventEmitter<number>();

	@Output()
	public idSkillRemved = new EventEmitter();

	@Output()
	public validForm = new EventEmitter();

	@Output()
	public behaviorsArray = new EventEmitter();

	edit: boolean = false;
	public static skill: ISkill;

	get skillName(): string {
		return ItemTestSkillComponent.skill.name;
	}

	public isCollapsed = false;

	constructor(private formBuilder: FormBuilder) {

	}

	ngOnInit() {
		console.log('item', this.item);
		this.form = this.formBuilder.group({
			skillId: this.item.id,
			skillName: this.item.name,
			behaviours: this.formBuilder.array([]),

		});
		let arl = this.form.get('behaviours') as FormArray;
		this.item.behaviors.forEach(e => {
			//console.log('for e', e);
			if (e.questionsId) {
				this.edit = true;
				arl.push(
					this.formBuilder.group({
						id: this.formBuilder.control(e.questionsId),
						question_1: this.formBuilder.control(e.questions[0], [Validators.required]),
						question_2: this.formBuilder.control(e.questions[1], [Validators.required]),
						question_3: this.formBuilder.control(e.questions[2], [Validators.required]),
						question_4: this.formBuilder.control(e.questions[3], [Validators.required]),
						question_5: this.formBuilder.control(e.questions[4], [Validators.required]),
						feedback_1: this.formBuilder.control(e.feedbacks[0], [Validators.required]),
						feedback_2: this.formBuilder.control(e.feedbacks[1], [Validators.required]),
						feedback_3: this.formBuilder.control(e.feedbacks[2], [Validators.required]),
						feedback_4: this.formBuilder.control(e.feedbacks[3], [Validators.required]),
						behaviorId: this.formBuilder.control(e.id),
						skillId: this.formBuilder.control(e.skillId),
					})
				)
			} else {
				arl.push(
					this.formBuilder.group({
						question_1: this.formBuilder.control('', [Validators.required]),
						question_2: this.formBuilder.control('', [Validators.required]),
						question_3: this.formBuilder.control('', [Validators.required]),
						question_4: this.formBuilder.control('', [Validators.required]),
						question_5: this.formBuilder.control('', [Validators.required]),
						feedback_1: this.formBuilder.control('', [Validators.required]),
						feedback_2: this.formBuilder.control('', [Validators.required]),
						feedback_3: this.formBuilder.control('', [Validators.required]),
						feedback_4: this.formBuilder.control('', [Validators.required]),
						behaviorId: this.formBuilder.control(e.id),
						skillId: this.formBuilder.control(e.skillId),
					})
				)
			}
		});
	}

	f() {
		// return this.form.controls;
		return (this.form.get('behaviours') as FormArray).controls;

	}


	removeAddskillMenu() {
		this.idSkillRemved.emit(this.item);
	}
	/**
	 * Show Data Console Log
	 */
	logg() {
		console.log(this.form.value);
		this.sendData();
	}
	/**
	 * Emit data output anf format data for json
	 */
	sendData() {
		let data = this.form.value;
		console.log('form data', data);

		let body: questionsTest = { questions: [] };

		if (this.form.valid) {
			if (this.edit) {
				//Editar preguntas
				data.behaviours.forEach(element => {
					body.questions.push(
						{
							id: element.id,
							skillId: element.skillId,
							questions: [element.question_1, element.question_2, element.question_3, element.question_4, element.question_5],
							feedbacks: [element.feedback_1, element.feedback_2, element.feedback_3, element.feedback_4],
							behaviorId: element.behaviorId
						}
					)
				});
			} else {
				// Guardar preguntas
				data.behaviours.forEach(element => {
					body.questions.push(
						{
							skillId: element.skillId,
							questions: [element.question_1, element.question_2, element.question_3, element.question_4, element.question_5],
							feedbacks: [element.feedback_1, element.feedback_2, element.feedback_3, element.feedback_4],
							behaviorId: element.behaviorId
						}
					)
				});
			}
			console.log('body Array', body);
			this.validForm.emit(true);
			this.behaviorsArray.emit({ body: body });

		} else {
			this.validForm.emit(false);
		}




	}


	static buildItem(skill: ISkill) {
		this.skill = skill;
		return new FormGroup({
			skillId: new FormControl(skill.id, [Validators.required]),
			skillName: new FormControl(skill.name, Validators.required),
			question_1: new FormControl('', [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_2: new FormControl('', [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_3: new FormControl('', [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_4: new FormControl('', [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_5: new FormControl('', [
				Validators.required,
				Validators.maxLength(200)
			]),
			feedback_1: new FormControl('', [
				Validators.required,
				Validators.maxLength(500)
			]),
			feedback_2: new FormControl('', [
				Validators.required,
				Validators.maxLength(500)
			]),
			feedback_3: new FormControl('', [
				Validators.required,
				Validators.maxLength(500)
			]),
			feedback_4: new FormControl('', [
				Validators.required,
				Validators.maxLength(500)
			])
		})
	}

	/**
	 * 
	 * @param item 
	 * @param skill
	 * 
	 *     "questionsTest":[{
			"skillId": 5,
			"questions":["pregunta str","2","3","4","5"],
			"feedbacks":["1","2","3"],
			"behaviorId": 4
		},
		{
			"skillId": 5,
			"questions":["1","2","3","4","5"],
			"feedbacks":["1","2","3"],
			"behaviorId": 5
		},
		{
			"skillId": 5,
			"questions":["1","2","3","4","5"],
			"feedbacks":["1","2","3"],
			"behaviorId": 6
		},
		{
			"skillId": 5,
			"questions":["1","2","3","4","5"],
			"feedbacks":["1","2","3"],
			"behaviorId": 7
		}] 

			static buildToEdit(item: any, skill: any) {
		return new FormGroup({
			id: new FormControl(item.id),
			skillId: new FormControl(skill.id, [Validators.required]),
			skillName: new FormControl(skill.name, Validators.required),

			question_1: new FormControl(item.question_1, [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_2: new FormControl(item.question_2, [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_3: new FormControl(item.question_3, [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_4: new FormControl(item.question_4, [
				Validators.required,
				Validators.maxLength(200)
			]),
			question_5: new FormControl(item.question_5, [
				Validators.required,
				Validators.maxLength(200)
			]),
			feedback_1: new FormControl(item.feedback_1, [
				Validators.required,
				Validators.maxLength(500)
			]),
			feedback_2: new FormControl(item.feedback_2, [
				Validators.required,
				Validators.maxLength(500)
			]),
			feedback_3: new FormControl(item.feedback_3, [
				Validators.required,
				Validators.maxLength(500)
			])
		});
	}


	 */


}
export interface questionsTest {
	questions?: Array<{
		id?: any;
		skillId?: number,
		questions?: any[],
		feedbacks?: any[],
		behaviorId?: number
	}>;
}
