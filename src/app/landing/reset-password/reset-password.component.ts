import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegexUtils } from 'src/app/utils/regex-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiNoAuth } from 'src/app/utils/api-no-auth';
import { Entities } from '@services/entities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

	private entidad: string = Entities.validateToken;
	private changePw: string = Entities.changePassword;

	public _hash: string;
	public _loading: boolean;
	public _loadingPage: boolean;
	public _validToken: boolean;
	public formRestore: FormGroup;

	public isOut: boolean;
	public _businessProfile: boolean = false;


	get validatePWrequirement_1(): boolean {
		return this.validatePWrequirement(1);
	}

	get validatePWrequirement_2(): boolean {
		return this.validatePWrequirement(2);
	}

	get validatePWrequirement_3(): boolean {
		return this.validatePWrequirement(3);
	}

	get validatePWrequirement_4(): boolean {
		return this.validatePWrequirement(4);
	}

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private _apiNoAuth: ApiNoAuth,
		private alert: DialogService
	) { }

	ngOnInit() {

		this.isOut = this.router.url.toString().includes('home/');
		this._businessProfile = this.router.url.toString().includes('/business/');

		this._loading = false;
		this._loadingPage = true;

		this._hash = this.activatedRoute.snapshot.params.key;



		this._apiNoAuth.get(this.entidad, this._hash).subscribe(resp => {
			this._loadingPage = false;
			this._validToken = true;
			console.log('response from component: ', resp);
		}, err => {
			this._loadingPage = false;
			this._validToken = false;
			console.log('error: ', err);
			// alert(err);
		});


		console.log('key: ', this._hash);

		this.formRestore = new FormGroup({
			password: new FormControl('', [
				Validators.required,
				Validators.pattern(RegexUtils._password)
			]),
			passwordConfirmation: new FormControl('', [
				Validators.required,
				Validators.minLength(6)
			])
		});
	}

	public resetPassword() {
		if (this.formRestore.valid) {
			this._loading = true;
			let form = this.formRestore.value;

			let entity = this.changePw + '/' + this._hash;
			this._apiNoAuth.post(entity, form).subscribe(resp => {
				this._loading = false;
				
				// alert(resp.message);
				this.alert.success(resp.message);
				this.closeModal();
			}, err => {
				this._loading = false;
				alert(err);
			});
		} else {
			alert('La contraseña ingresada no es válida.');
		}
	}

	validatePWrequirement(value: number): boolean {
		let text: string;

		text = this.formRestore.controls.password.value;



		let hasNumber: string | RegExp = /\d/;
		let hasLetter: string | RegExp = /[a-zA-Z]/;
		let nonWhiteSpace: string | RegExp = /^(\S)+$/;
		let minLength: string | RegExp = /^[\w|\D]{6,}$/;

		switch (value) {
			case 1:
				return hasNumber.test(text);
			case 2:
				return hasLetter.test(text);
			case 3:
				return nonWhiteSpace.test(text);
			case 4:
				return minLength.test(text);
		}
	}

	public closeModal(): void {

		if (this.isOut || this._businessProfile) {
			console.log('first');

			const strRoute = (this._businessProfile) ? '../business' : '../home';

			this.router.navigate(
				[
					strRoute,
					{
						outlets: {
							modal: null
						}
					}
				],
				{
					relativeTo: this.activatedRoute.parent
				}
			);
		} else {
			console.log('second');
			this.router.navigate(['./login']);
		}

	}

}
