import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegexUtils } from 'src/app/utils/regex-utils';
import { ApiNoAuth } from 'src/app/utils/api-no-auth';
import { Entities } from '@services/entities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
	selector: 'app-password-recovery',
	templateUrl: './password-recovery.component.html',
	styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

	private entidad: string = Entities.resetPassword;

	public _loading: boolean;
	public _emailControl: FormControl;

	public isOut: boolean;
	public _businessProfile: boolean = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private apiNoAuth: ApiNoAuth,
		private alert: DialogService
	) { }

	ngOnInit() {
		this.isOut = this.router.url.toString().includes('home/');
		this._businessProfile = this.router.url.toString().includes('/business/');

		this._loading = false;
		this._emailControl = new FormControl('', [
			Validators.required,
			Validators.pattern(RegexUtils._rxEmail)
		]);
	}

	public recovery(){
		if(this._emailControl.valid){
			this._loading = true;
			let email = this._emailControl.value;
			let body = {email: email};

			this.apiNoAuth.post(this.entidad, body).subscribe(response => {
				this._loading = false;

				if(response.code == 1){
					// alert(response.message);
					this.alert.success(response.message);
					this.closeModal();
				}

			}, err => {
				this._loading = false;
				console.log('component error: ', err)
				this.alert.error(err);
			});
	
		}else{
			alert('El correo electrónico ingresado es inválido');
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
