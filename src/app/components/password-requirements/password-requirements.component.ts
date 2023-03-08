import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-password-requirements',
	templateUrl: './password-requirements.component.html',
	styleUrls: ['./password-requirements.component.scss']
})
export class PasswordRequirementsComponent implements OnInit {

	@Input() password: string = '';

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

	constructor() { }

	ngOnInit() {
	}

	validatePWrequirement(value: number): boolean {
		let text: string;
		text = this.password;

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
}