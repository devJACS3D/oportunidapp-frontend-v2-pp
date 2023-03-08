import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegexUtils } from '@utils/regex-utils';
import { Utilities } from '@utils/utilities';
import { ApiNoAuth } from '@utils/api-no-auth';
import { Entities } from '@services/entities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ApiResponse } from '@apptypes/api-response';
import { ValidateEmailNotTaken } from '@utils/validators/async-email.validator';
import { ValidateUsernameNotTaken } from '@utils/validators/async-username.validator';
import { UserAccountService } from '@services/user-account.service';

@Component({
	selector: 'app-register-user',
	templateUrl: './register-user.component.html',
	styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

	public _terms: boolean = false;

	public _maskPhone = RegexUtils._maskPhone;

	public _loading: boolean;
	public errorMessage: string;
	public formRegister: FormGroup;

	public _showErrorMessage: boolean;

	public docsApp = {
		usagePolicies: Utilities.getDocumentsApp('usagePolicies'),
		terms: Utilities.getDocumentsApp('terms')
	}

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private apiNoAuth: ApiNoAuth,
		private alert: DialogService,
		private userAccount: UserAccountService
	) { }

	ngOnInit() {
		this._showErrorMessage = false;
		this._loading = false;

		this.formRegister = new FormGroup({
			firstName: new FormControl('', [
				Validators.required,
				Validators.maxLength(100)
			]),
			secondName: new FormControl('', [
				// Validators.required,
				Validators.maxLength(100)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.maxLength(100)
			]),
			secondLastName: new FormControl('', [
				Validators.required,
				Validators.maxLength(100)
			]),
			email: new FormControl('', [
				Validators.required,
				Validators.pattern(RegexUtils._rxEmail)
			],
				ValidateEmailNotTaken.createValidator(this.apiNoAuth)),
			cellphone: new FormControl('', [
				//Validators.required,
				Validators.pattern(RegexUtils._rxPhone),
				Validators.maxLength(15)
			]),
			username: new FormControl('', [
				Validators.required,
				Validators.pattern(RegexUtils._username)
			],
				ValidateUsernameNotTaken.createValidator(this.apiNoAuth, null)),
			password: new FormControl('', [
				Validators.required,
				Validators.pattern(RegexUtils._password)
			]),
			passwordConfirmation: new FormControl('', [
				Validators.required,
			])
		});

		document.querySelector('body').style.overflow = 'hidden';
	}

	ngOnDestroy() {
		document.querySelector('body').style.overflow = 'auto';
	}

	public async  register() {
		let password = this.formRegister.controls.password.value;
		let password2 = this.formRegister.controls.passwordConfirmation.value;

		if (this.formRegister.valid && password == password2) {
			if (this._terms) {
				this._loading = true;
				try {
					const body = this.formRegister.value;
					let registerResp: ApiResponse = await this.apiNoAuth.post(Entities.userRegister, body).toPromise();

					if (registerResp.code == 1) {
						this.alert.success(registerResp.message);
						// Loggear usuario.
						this.userAccount.setUser(registerResp.response.user);
						this.close();
						// Redirigir al perfil
					}

				} catch (err) {
					console.log('component error: ', err)
					this.errorMessage = err;
				}
			} else {
				this._showErrorMessage = true;
			}
		} else {
			Utilities.markAsDirty(this.formRegister);
		}
	}

	public clearMessage() {
		this.errorMessage = '';
	}

	public close() {
		this.router.navigate(
			[
				{
					outlets: {
						modal: null
					}
				}
			],
			{
				relativeTo: this.activatedRoute.parent // <--- PARENT activated route.
			}
		);
	}
}
