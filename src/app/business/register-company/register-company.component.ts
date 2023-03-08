import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidateEmailNotTaken } from '@utils/validators/async-email.validator';
import { ApiNoAuth } from '@utils/api-no-auth';
import { RegexUtils } from '@utils/regex-utils';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilities } from '@utils/utilities';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { UserAccountService } from '@services/user-account.service';

@Component({
	selector: 'app-register-company',
	templateUrl: './register-company.component.html',
	styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {

	public _terms: boolean;
	public _showErrorMessage: boolean;
	public _loading: boolean;
	public errorMessage: string = '';

	public formRegister: FormGroup;

	public docsApp = {
		usagePolicies: Utilities.getDocumentsApp('usagePolicies'),
		terms: Utilities.getDocumentsApp('terms')
	}

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private apiNoAuth: ApiNoAuth,
		private alert: DialogService,
		private userAccount:UserAccountService
	) { }

	ngOnInit() {

		this.formRegister = new FormGroup({
			nit: new FormControl('', [
				Validators.required,
				Validators.maxLength(11)
			]),
			typeCompany: new FormControl(1, [
				Validators.required,
			]),
			email: new FormControl('', [
				Validators.required,
				Validators.pattern(RegexUtils._rxEmail)
			],
				ValidateEmailNotTaken.createValidator(this.apiNoAuth)),
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

	public clearMessage() {
		this.errorMessage = '';
	}

	public async register() {
		let password = this.formRegister.controls.password.value;
		let password2 = this.formRegister.controls.passwordConfirmation.value;

		if (this.formRegister.valid && password == password2) {
			const body = this.formRegister.value;
			if (this._terms) {
				if (RegexUtils.validateNit(body.nit)) {
					this._loading = true;

					try {
						let registerResp: ApiResponse = await this.apiNoAuth.post(Entities.userCompany, body).toPromise();
						if (registerResp.code == 1) {
							this.alert.success(registerResp.message);
							this.userAccount.setUser(registerResp.response.user);
							this.close();
						}

					} catch (err) {
						console.log('errr');

						this.errorMessage = err;
						if (err === 'Error creando la empresa. username must be unique') {
							this.errorMessage = 'El Nit ya se encuentra registrado';
						}
					}

					this._loading = false;

				} else {
					this.errorMessage = 'El Nit es inválido, asegurese de escribir correctamente el Nit con su dígito de verificación';
				}
			} else {
				this._showErrorMessage = true;
			}
		} else {
			Utilities.markAsDirty(this.formRegister);
			this.errorMessage = '¡Debe completar el formulario para continuar!';
		}
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
