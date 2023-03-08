import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Utilities } from '@utils/utilities';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITest } from '@apptypes/entities/test';

@Component({
	selector: 'app-form-user-tests',
	templateUrl: './form-user-tests.component.html',
	styleUrls: ['./form-user-tests.component.scss']
})
export class FormUserTestsComponent implements OnInit, OnDestroy {

	public isSubmitting: boolean;
	public radioButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	public radioButtonIdCount = 1;
	public test: ITest;
	testAnswersForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private api: Api,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private alert: DialogService
	) { }

	async ngOnInit() {

		const testObservable = this.activatedRoute.data.pipe(map((res) => res.test));
		const vacancyIdObservable = this.activatedRoute.params.pipe(
			map((params: Params) => params.vacancyId));

		combineLatest(testObservable, vacancyIdObservable).subscribe(data => {
			data[0]['vacancyId'] = data[1];
			// data[0] = ITest
			this.test = data[0];
			this.initForm(data[0]);
		});
	}

	ngOnDestroy() {
		document.querySelector('body').style.overflow = 'auto';
	}

	private initForm(data: ITest) {
		this.testAnswersForm = this.formBuilder.group({
			vacancyId: this.formBuilder.control(data['vacancyId'], Validators.required),
			testId: this.formBuilder.control(data.id, Validators.required),
			questionsTest: this.setQuestionTest(data.questionstest)
		});
	}

	setQuestionTest(questions: any[]): FormArray {
		const formArray = this.formBuilder.array([]);

		questions.forEach(question => {
			formArray.push(this.formBuilder.group({
				id: this.formBuilder.control(question.id, Validators.required),
				questions: this.setQuestions(question.questions),
				answers: this.setAnswers(question.questions.length)
			}));
		});
		return formArray;
	}

	private setQuestions(questions: any[]): FormArray {
		const formArray = this.formBuilder.array([]);
		questions.forEach(q => {
			formArray.push(this.formBuilder.control(q));
		});
		return formArray;
	}
	private setAnswers(length: number): FormArray {
		const formArray = this.formBuilder.array([]);
		for (let index = 0; index < length; index++) {
			formArray.push(this.formBuilder.control(null,[Validators.required]));
		}
		return formArray;
	}

	public get questionsTest(): FormArray {
		return this.testAnswersForm.get('questionsTest') as FormArray;
	}
	
	public getAnswerControlAt(idx1: number, idx: number) {
		const questionTest = this.questionsTest;
		const answers = questionTest.at(idx1).get('answers') as FormArray;
		return answers.at(idx);
	}


	setAnswer(formArray: FormArray,questionId: number,value: string) {
		const control:AbstractControl = formArray.at(questionId)
		control.setValue(Number(value));
	}
	public async save() {
			this.isSubmitting = true;
			try {
				let resp = await this.api.post(Entities.userTests, this.testAnswersForm.value).toPromise();
				this.back();
				this.alert.success(resp.message);
			} catch (err) {
				this.alert.errorAlert(err)
			}finally{
				this.isSubmitting = false;
			}
	}


	public async back() {
		this.router.navigate(['home/profile']).then(() => {
			this.router.navigate(['home/profile/user-tests']);
		})
	}

	public close() {
		this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
	}

	
}
